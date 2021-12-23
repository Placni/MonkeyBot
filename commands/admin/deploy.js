const Discord = require('discord.js');
const dbhelper = require('@util/dbhelper.js');

//Lots of code here borrowed from 5xp
//https://github.com/5xp/schnoobot/blob/master/commands/owner/deploy.js#L34

module.exports = {
    name: "deploy",
    description: "deploys slash commands",
    alias: ["deploy"],
    disabled: false,
    async execute(message, args, client) {
        if (message.author.id !== process.env.OWNERID) return message.reply('You must be the owner to use this!');

        const cmds = message.client.commands
            .filter(command => command.slash)
            .map(command => {
                let {
                    name,
                    description = "missing description",
                    options = [],
                    slash = false,
                    defaultPermission = true,
                    slashPermissions = [],
                } = command;
                if (typeof name === "string") name = [name];
                const cmd = { name: name[0], description, options, defaultPermission, permissions: slashPermissions };
                return cmd;
            });

            await setCommands(message.guild?.commands)
                .then(message.reply(`Registered ${cmds.length} commands to this guild!`));


        async function setCommands(commandManager) {
            const appCommands = await commandManager.set(
                commandManager?.guild ? cmds : cmds.filter(cmd => !cmd.permissions.length)
            );
            if (commandManager?.guild) {
                const fullPermissions = appCommands
                    .map(appCommand => {
                        const permissions = cmds.find(cmd => cmd.name === appCommand.name).permissions;
                        return { id: appCommand.id, permissions };
                    })
                    .filter(appCommand => appCommand.permissions.length);
                await commandManager.permissions.set({ fullPermissions });
            }
        }
    }
}