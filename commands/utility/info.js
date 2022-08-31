const Discord = require('discord.js');
const { hhmmss } = require('@util/common');

module.exports = {
    name: "info",
    description: "displays info about the bot",
    usage: `\`${process.env.PREFIX}info\``,
    alias: [],
    disabled: false,
    slash: true,
    async execute(interaction, args, client) {
        const isSlash = interaction.isCommand?.();
        let uptime = hhmmss((Date.now() - client.readyAt) / 1000);

        if (!isSlash) {
            reply = await interaction.reply('Resolving...');
            reply.edit({ content: null, embeds: [createEmbed(Math.round((reply.createdTimestamp - interaction.createdTimestamp)))] });
        } else {
            reply = await interaction.deferReply({ fetchReply: true });
            interaction.editReply({ embeds: [createEmbed(Math.round((reply.createdTimestamp - interaction.createdTimestamp)))] });
        }

        function createEmbed(ping) {
            const embed = new Discord.MessageEmbed()
                .setColor('#803d8f')
                .setAuthor(`Monkeybot`, client.user.avatarURL())
                .addFields({ name: 'Info', value: `Users: \`${client.users.cache.size}\`\nGuilds: \`${client.guilds.cache.size}\`\nUptime: \`${uptime}\`\nPing: \`${ping}ms\`\nAPI Latency: \`${client.ws.ping}ms\`` })
            return embed;
        }
    }
}