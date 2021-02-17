const common = require('../common');
const Discord = require('discord.js');

module.exports = {
    name: "getpfp",
    description: "grabs pfp of user",
    usage: `\`${process.env.PREFIX}getpfp @user\``,
    category: "Utils",
    alias: ["getpfp", "pfp", "avatar"],
    disabled: false,
    execute(message, args){ 
        var comname = "getpfp";
        let format = { format: "png", dynamic: true, size: 2048 };
        let argString = common.ArgsToString(args);
        let target;

        if (!argString){
            target = message.member;
        } else {
            target = common.GetUserID(argString, message);
            if (!target){
                message.reply(" couldn't find desired user!");
                common.logerror(message, comname, "couldn't find desired user");
                return;
            }
        }

        const pfpEmbed = new Discord.MessageEmbed()
        .setColor('#803d8f')
        .setAuthor(`${target.displayName}'s pfp`)
        .setImage(target.user.avatarURL(format))
        .setFooter(`Called by ${message.author.tag}`)
        .setTimestamp()

        message.channel.send(pfpEmbed);
        common.logsuccess(message, comname, "");
    }
}