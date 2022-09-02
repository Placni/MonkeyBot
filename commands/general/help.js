const { MessageEmbed } = require('discord.js');
const { sanitizeString } = require('@util/common');

module.exports = {
    name: "help",
    description: "Displays helpful information about MonkeyBot",
    usage: `\`${process.env.PREFIX}help\``,
    alias: ["h"],
    disabled: false,
    slash: true,
    options: [
        {
            name: "command",
            type: "STRING",
            description: "Get a detailed description of a specific command",
            required: false
        }
    ],
    async execute(interaction, args, client){
        const isSlash = interaction.isCommand?.();
        const userId = (isSlash) ? interaction.user.id : interaction.author.id;

        if(isSlash){
            await interaction.deferReply({ ephemeral: true });
            var com = interaction.options?.getString('command');
            if(!com){
                return interaction.editReply({ embeds: [helpEmbed()], ephemeral: true });
            } else {
                com = sanitizeString(com, false).toLowerCase();
                return interaction.editReply(comEmbed(com));
            }
        } else {
            return interaction.reply({ embeds: [helpEmbed()] });
        }

        function helpEmbed(){
            const helpEmbed = new MessageEmbed()
            .setColor('#803d8f')
            .setDescription(`<@${client.user.id}> is a Discord bot written by [Myssto](https://github.com/Placni) to learn more about JS`)
            .addFields(
                {name: 'Have a question, suggestion, bug report, or interested in how I\'m learning JS?', value: 'Feel free to DM me @Myssto#0001'},
                {name: 'Want to learn more about a command?', value: 'Try specifying a command name with the `help` slash command'},
                {name: 'Want to invite the bot to your server?', value: 'Try using this invite link'},
                {name: 'Servers', value: `${client.guilds.cache.size}`, inline: true},
                {name: 'Users', value: `${client.users.cache.size}`, inline: true},
                {name: 'Boot-up', value: `<t:${Math.trunc(client.readyTimestamp / 1000)}:R>`, inline: true},
                {name: 'Interested in the code?', value: 'All source code can be found on [github](https://github.com/Placni/MonkeyBot)'}
            )
            return helpEmbed;
        }
        function comEmbed(com){
            // Map an object with command information we want
            com = client.commands
                .filter(command => command.name === com)
                .map(command => {
                    let {
                        name,
                        category,
                        description = 'Missing description',
                        slash = false,
                        disabled = false,
                        usage = 'Missing usage',
                        alias = ['None'],
                        permission = ['Default Permissions'],
                    } = command;
                    if(alias[0] !== 'None') alias = ('[' + alias.join(" | ") + ']');
                    if(permission[0] !== 'Default Permissions') permission = ('[' + permission.join(" | ") + ']');
                    const cmd = { name, category, description, slash, disabled, usage, alias, permission };
                    return cmd
                });

            // Check for missing or owner commands
            if(!com.length) return { content: 'Couldn\'t find requested command!\n Use /commands to see a current list', ephemeral: true };
            if(com[0].category === 'owner' && userId !== process.env.OWNERID) return { content: 'You must be the owner to view that command!' };

            // Do some type method stuff to create a readble
            // format from the command object
            const infoString = JSON.stringify(com[0])
                .replace(/[{}]/g, '').replaceAll(':', '**:  ').replaceAll('"', '')
                .split(',')
                .slice(2)
                .map(e => {return '**' + e.charAt(0).toUpperCase() + e.slice(1)})
                .join('\n');

            const comEmbed = new MessageEmbed()
                .setColor('#803d8f')
                .setTitle(com[0].name)
                .setDescription(infoString)
            return { embeds: [comEmbed], ephemeral: true };
        }
    }
}