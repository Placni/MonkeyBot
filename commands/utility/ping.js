const { ApplicationCommandType, InteractionType } = require('discord.js');

module.exports = {
    name: "ping",
    description: "Responds with latency measurements",
    usage: `\`${process.env.PREFIX}ping\``,
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    async execute(interaction) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        if (isSlash) {
            let reply = await interaction.deferReply({ fetchReply: true, ephemeral: true });
            interaction.editReply({ content: `🏓 Pong! \nLatency is **${Math.round(reply.createdTimestamp - interaction.createdTimestamp)}ms**`, ephemeral: true });
        } else {
            let reply = await interaction.reply('Resolving...');
            reply.edit(`🏓 Pong! \nLatency is **${Math.round(reply.createdTimestamp - interaction.createdTimestamp)}ms**`);
        }
    }
}