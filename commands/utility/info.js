const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "info",
    description: "displays info about the bot",
    usage: `\`${process.env.PREFIX}info\``,
    alias: [],
    disabled: false,
    async execute(message, args, client){ 

        let uptime = (Date.now() - client.readyAt) / 1000;
        let hrs = Math.floor((uptime / 60) / 60);
        let mins = Math.floor((uptime / 60) - (hrs * 60));
        let secs = Math.floor(uptime - ((hrs * 60 * 60) + (mins * 60)));
        uptime = `${hrs}hrs ${mins}mins ${secs}s`;

        message.channel.send('Resolving').then(msg => {
            msg.delete();
            message.channel.send({embeds: [createEmbed(msg.createdTimestamp - message.createdTimestamp)]});
        })

        function createEmbed(ping){
            const embed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`Monkeybot`, client.user.avatarURL())
            .addFields(
                {name: 'Info', value: `Users: \`${client.users.cache.size}\`\nGuilds: \`${client.guilds.cache.size}\`\nUptime: \`${uptime}\`\nPing: \`${ping}ms\`\nAPI Latency: \`${client.ws.ping}ms\``},
                )
            return embed;
        }
    }
}