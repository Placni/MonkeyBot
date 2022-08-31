const { MessageEmbed } = require('discord.js');
const { hhmmss } = require('@util/common');

module.exports = {
    name: "help",
    description: "Displays helpful information about MonkeyBot",
    usage: `\`${process.env.PREFIX}help\``,
    alias: ["h"],
    disabled: false,
    slash: true,
    options: {
        name: "command",
        type: "STRING",
        description: "Get a detailed description of a specific command",
        required: "false"
    },
    async execute(interaction, args, client){
        const isSlash = interaction.isCommand?.();
        let uptime = hhmmss((Date.now() - client.readyAt) / 1000);

        const helpEmbed = new MessageEmbed()
            .setColor('#803d8f')
            .setAuthor({text: `<@${client.user.id}> is a Discord bot written by [Myssto](https://github.com/Placni) to learn more about JS`})
            .addFields(
                {name: `Have a question, suggestion, bug report, or interested in how I'm learning JS?`, value: `Feel free to DM me @Myssto#1000`},
                {name: `Want to learn more about a command?`, value: 'Try specifying a command name with the `help` slash command'},
                {name: `Want to invite the bot to your server?`, value: `Try using this invite link`},
                {name: 'Servers', value: client.guilds.cache.size, inline: true},
                {name: 'Users', value: client.users.cache.size, inline: true},
                {name: 'Uptime', value: uptime, inline: true},
                {name: 'Interested in the code?', value: 'All source code can be found on [Github](https://github.com/Placni/MonkeyBot)'}
            )
    }
}