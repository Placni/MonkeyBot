const { findVC } = require('@util/common');

module.exports = {
    name: "deafcheck",
    description: "Moves deafened users out of the vc",
    usage: `\`${process.env.PREFIX}deafcheck <channel>\``,
    alias: ["deaf"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'channel',
            type: 'CHANNEL',
            channelTypes: ['GUILD_VOICE'],
            description: 'Channel to remove users from',
            required: true
        }
    ],
    permission: ['MOVE_MEMBERS'],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        if(isSlash){
            let targetVC = await findVC(interaction.options.getChannel('channel'), interaction);
            if(targetVC) return interaction.reply({content: 'An error has occured', ephemeral: true});
            let moved = deafCheck(targetVC);
            return interaction.reply({ content: `Removed ${moved} members from ${targetVC.name}`, ephemeral: true });
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a voice channel!'});
            let targetVC = findVC(args[0], interaction);
            if(!targetVC) return interaction.reply({ content: 'Error finding specified voice channel!' });
            let moved = deafCheck(targetVC);
            return interaction.reply({ content: `Removed ${moved} users from ${targetVC.name}` });
        }
        function deafCheck(targetVC) {
            let i;
            let channel = (!common.findVC('afk', interaction)) ? common.findVC('afk', interaction) : null;
            for(let [snowflake, guildMember] of targetVC.members){
                if(guildMember.voice.selfDeaf){
                    guildMember.voice.setChannel(channel);
                    guildMember.send(`**${interaction.member.user.tag}** removed you from vc for being deafened`);
                    i++;
                }
            return i;
            }
        }
    }
}