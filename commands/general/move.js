const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, InteractionType } = require('discord.js');
const { findVC } = require('@util/common');

module.exports = {
    name: "move",
    description: "Move all users from one vc to another",
    usage: `\`${process.env.PREFIX}move <vc1> <vc2>\``,
    alias: ["mv"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'target',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [2],
            description: 'Channel to move users from',
            required: true
        },
        {
            name: 'destination',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [2],
            description: 'Channel to move users into',
            required: true
        }
    ],
    permission: PermissionFlagsBits.MoveMembers,
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;

        if (isSlash) {
            const targetChannel = await interaction.options.getChannel('target');
            const destChannel = await interaction.options.getChannel('destination');
            if(!targetChannel || !destChannel) return interaction.reply({ content: 'An error has occured', ephemeral: true });
            if(targetChannel.members.size == 0) return interaction.reply({ content: 'Pick a target channel with users in it!', ephemeral: true });
            const moved = moveMembers(targetChannel, destChannel);
            interaction.reply({ content: `Moved ${moved} user(s) from **${targetChannel.name}** to **${destChannel.name}**`, ephemeral: true });
        } else {
            if (!args.length) return interaction.reply('Specify a target and destination channel!');
            const targetChannel = findVC(args[0], interaction);
            const destChannel = findVC(args[1], interaction);
            if(!targetChannel || !destChannel) return interaction.reply(`Couldn't locate specified channels!`);
            if(targetChannel.members.size == 0) return interaction.reply(`Pick a target channel with users in it!`);
            const moved = moveMembers(targetChannel, destChannel);
            interaction.reply(`Moved ${moved} user(s) from **${targetChannel.name}** to **${destChannel.name}**`);
        }

        function moveMembers(target, dest) {
            let i = 0;
            for(const guildMember of target.members) {
                guildMember.voice.setChannel(dest);
                i++;
            }
            return i;
        }
    }
};