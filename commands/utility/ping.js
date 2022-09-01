module.exports = {
    name: "ping",
    description: "Responds with latency measurements",
    usage: `\`${process.env.PREFIX}ping\``,
    alias: ["latency"],
    disabled: false,
    slash: true,
    async execute(interaction, args, client) {
        const isSlash = interaction.isCommand?.();
        if (isSlash) {
            let reply = await interaction.deferReply({ fetchReply: true, ephemeral: true });
            interaction.editReply({ content: `🏓 Pong! \nLatency is **${Math.round(reply.createdTimestamp - interaction.createdTimestamp)}ms**`, ephemeral: true });
        } else {
            let reply = await interaction.reply('Resolving...');
            reply.edit(`🏓 Pong! \nLatency is **${Math.round(reply.createdTimestamp - interaction.createdTimestamp)}ms**`);
        }
    }
}