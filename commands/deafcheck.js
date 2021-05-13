const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "deafcheck",
    description: "moves deafened users out of the vc",
    usage: `\`${process.env.PREFIX}deafcheck <channel>\``,
    category: "Admin",
    alias: ["deafcheck"],
    disabled: false,
    permission: ['MOVE_MEMBERS'],
    execute(message, args){ 
        if(!args[0]) return message.reply(" specify a channel you monkey");

        let targetChannel = common.GetVcID(args.shift(), message);
        if(!targetChannel) return message.reply(" couldn't find target channel!");
        if(targetChannel.members.size == 0) return message.reply(" the target channel must have users in it!");

        let i = 0
        let channel = common.GetVcID('afk', message);
        if(!channel) channel = null;
        for(let [snowflake, guildMember] of targetChannel.members){
            if(guildMember.voice.selfDeaf){
                guildMember.voice.setChannel(channel);
                message.channel.send(`**${guildMember.user.tag}** was removed from vc for being deafened`);
                guildMember.send(`**${message.author.tag}** removed you from vc for being deafened`);
                i++;
            }
        }
    }
}