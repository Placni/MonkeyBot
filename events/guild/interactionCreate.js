const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, interaction) => {
    if (!interaction.guild || !interaction.isCommand() || interaction.user.bot) return;
    const command = client.commands.get(interaction.commandName);
    const { disabled = false, permission = [], execute } = command;
    let guildId = interaction.member.guild.id;

    const missingPerms = permission.filter(perm => !interaction.member.permissions.has(perm));
    if (missingPerms.length) {
        return interaction.reply({
            content: `**You are missing permisson(s): ${missingPerms.map(p => `\`${p}\``).join(", ")}**`,
            ephemeral: true,
        });
    }
    if (disabled) return interaction.reply({ content: '**This command is currently disabled**', ephemeral: true })
    let settings = await dbhelper.getGuildSettings(guildId);
    if (settings.blacklist.includes(interaction.user.id)) return interaction.reply({ content: '**Seems like you have been blacklisted from using me in this guild**', ephemeral: true });

    execute(interaction, null, client).catch(err => {
        console.log(err);
        !interaction.deffered
            ? interaction.reply({ content: '**An error has occured.**', ephemeral: true })
            : interaction.followUp({ content: '**An error has occured.**', ephemeral: true });
    })
}