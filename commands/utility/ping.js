module.exports = {
    name: "ping",
    description: "responds with latency measurements",
    usage: `\`${process.env.PREFIX}ping\``,
    alias: ["latency"],
    disabled: false,
    slash: true,
    async execute(interaction, args, client) {
        const isSlash = interaction.isCommand?.();
        if (!isSlash) {
            reply = await interaction.reply('Resolving...');
            reply.edit(`🏓 Pong! \nLatency is **${Math.round((reply.createdTimestamp - interaction.createdTimestamp) - client.ws.ping)}ms**`);
        } else {
            reply = await interaction.deferReply({ fetchReply: true });
            interaction.editReply(`🏓 Pong! \nLatency is **${Math.round((reply.createdTimestamp - interaction.createdTimestamp) - client.ws.ping)}ms**`);
        }
    }
}