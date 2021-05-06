const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "deafcheck",
    description: "moves deafened users out of the vc",
    usage: `\`${process.env.PREFIX}deafcheck <channel>\``,
    category: "Admin",
    alias: ["deafcheck"],
    disabled: false,
    execute(message, args){ 
        if (!(message.author.id == process.env.OWNERID || message.member.hasPermission('MOVE_MEMBERS', 'ADMINISTRATOR'))){
            message.reply(" you don't have the permission to call this!");
            common.logerror(message, this.name, "invalid permision");
            return;
        }

        if(!args[0]) return message.reply(" specify a channel you monkey");

        let targetChannel = common.GetVcID(args.shift(), message);
        if(!targetChannel) return message.reply(" couldn't find target channel!");
        if(targetChannel.members.size == 0) return message.reply(" the target channel must have users in it!");

        let i = 0
        for(let [snowflake, guildMember] of targetChannel.members){
            if(guildMember.voice.selfDeaf){
                guildMember.voice.setChannel(null);
                message.channel.send(`**${guildMember.user.tag}** was removed from vc for being deafened`);
                guildMember.send(`**${message.author.tag}** removed you from vc for being deafened`);
                i++;
            }
        }
        common.logsuccess(message, this.name, `removed ${i} members from vc`);
    }
}