const { findVC } = require('@util/common');
const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, InteractionType } = require('discord.js');

module.exports = {
    name: "deafcheck",
    description: "Moves deafened users out of the vc",
    usage: `\`${process.env.PREFIX}deafcheck <channel>\``,
    alias: ["deaf"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'channel',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [2],
            description: 'Channel to remove users from',
            required: true
        }
    ],
    permission: PermissionFlagsBits.MoveMembers,
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        if(isSlash) {
            const targetVC = interaction.options.getChannel('channel');
            console.log(targetVC);
            if(targetVC.members?.size === 0) return interaction.reply({ content: `Voice channel must have users in it!`, ephemeral: true });
            return interaction.reply({ content: `Removed **${deafCheck(targetVC)}** user(s) from **${targetVC.name}**`, ephemeral: true });
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a voice channel!' });
            const targetVC = findVC(args[0], interaction);
            if(!targetVC) return interaction.reply({ content: 'Couldn\'t find that voice channel!' });
            if(targetVC.members?.size === 0) return interaction.reply({ content: `Voice channel must have users in it!` });
            return interaction.reply({ content: `Removed **${deafCheck(targetVC)}** user(s) from **${targetVC.name}**` });
        }
        function deafCheck(targetVC) {
            let i = 0;
            const channel = (!interaction.guild?.afkChannel) ? null : interaction.guild.afkChannel;
            for(const guildMember of targetVC.members) {
                if(guildMember.voice?.selfDeaf) {
                    guildMember.voice.setChannel(channel);
                    guildMember.send(`**${interaction.member.user.tag}** removed you from vc for being deafened`);
                    i++;
                }
            }
            return i;
        }
    }
};