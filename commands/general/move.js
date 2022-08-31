const { findVC } = require('@util/common');

module.exports = {
    name: "move",
    description: "Move all users from one vc to another",
    usage: `\`${process.env.PREFIX}move <vc1> <vc2>\``,
    alias: ["mv"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'target',
            type: 'CHANNEL',
            channelTypes: ['GUILD_VOICE'],
            description: 'Channel to move users from',
            required: true
        },
        {
            name: 'destination',
            type: 'CHANNEL',
            channelTypes: ['GUILD_VOICE'],
            description: 'Channel to move users into',
            required: true
        }
    ],
    permission: ['MOVE_MEMBERS'],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();

        if (isSlash){
            let targetChannel = await findVC(interaction.options.getChannel('target'), interaction);
            let destChannel = await findVC(interaction.options.getChannel('destination'), interaction);
            if(!targetChannel || !destChannel) return interaction.reply({content: 'An error has occured', ephemeral: true});
            if(targetChannel.members.size == 0) return interaction.reply({content: 'Pick a target channel with users in it!', ephemeral: true});
            let moved = moveMembers(targetChannel, destChannel);
            interaction.reply({content: `Moved ${moved} member(s) from **${targetChannel.name}** to **${destChannel.name}**`, ephemeral: true});
        } else {
            if (!args.length) return interaction.reply('Specify a target and destination channel!');
            let targetChannel = findVC(args[0], interaction);
            let destChannel = findVC(args[1], interaction);
            if(!targetChannel || destChannel) return interaction.reply(`Couldn't locate specified channels!`);
            if(targetChannel.members.size == 0) return interaction.reply(`Pick a target channel with users in it!`);
            let moved = moveMembers(targetChannel, destChannel);
            interaction.reply(`Moved ${moved} member(s) from **${targetChannel.name}** to **${destChannel.name}**`);
        }

        function moveMembers(target, dest){
            let i = 0
            for(let [snowflake, guildMember] of target.members){
                guildMember.voice.setChannel(dest);
                i++;
            }
            return i;
        }
    }
}