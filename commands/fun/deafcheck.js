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
            let targetVC = interaction.options.getChannel('channel');
            console.log(targetVC);
            if(targetVC.members?.size === 0) return interaction.reply({ content: `Voice channel must have users in it!`, ephemeral: true });
            return interaction.reply({ content: `Removed **${deafCheck(targetVC)}** user(s) from **${targetVC.name}**`, ephemeral: true });
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a voice channel!'});
            let targetVC = findVC(args[0], interaction);
            if(!targetVC) return interaction.reply({ content: 'Couldn\'t find that voice channel!' });
            if(targetVC.members?.size === 0) return interaction.reply({ content: `Voice channel must have users in it!` });
            return interaction.reply({ content: `Removed **${deafCheck(targetVC)}** user(s) from **${targetVC.name}**` });
        }
        function deafCheck(targetVC) {
            let i = 0;
            let channel = (!interaction.guild?.afkChannel) ? null : interaction.guild.afkChannel;
            for(let [snowflake, guildMember] of targetVC.members){
                if(guildMember.voice?.selfDeaf){
                    guildMember.voice.setChannel(channel);
                    guildMember.send(`**${interaction.member.user.tag}** removed you from vc for being deafened`);
                    i++;
                } else continue;
            }
            return i;
        }
    }
}