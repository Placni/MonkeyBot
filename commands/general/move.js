const { findVC } = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "move",
    description: "move all users from one vc to another",
    usage: `\`${process.env.PREFIX}move <vc1> <vc2>\``,
    alias: ["mv", "moveall"],
    disabled: false,
    permission: ['MOVE_MEMBERS'],
    execute(message, args){ 
        if (!args.length) return message.reply('Specify a target channel!');
        let origChannel = findVC(args[0], message);
        if (!origChannel) return message.reply('Couldnt find target channel!');
        if (origChannel.members.size == 0) return message.reply('The channel must have members to move!');
        let targetChannel = findVC(args[1], message);
        if (!targetChannel) return message.reply('Couldnt find target channel!');

        let i = 0
        for(let [snowflake, guildMember] of origChannel.members){
            guildMember.voice.setChannel(targetChannel);
            i++;
        }
        message.channel.send(`Moved ${i} member(s) from **${origChannel.name}** to **${targetChannel.name}**`);
    }
}