const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "getpfp",
    description: "grabs the avatar of a user",
    usage: `\`${process.env.PREFIX}getpfp <user>\``,
    alias: ["pfp", "avatar", "av"],
    disabled: false,
    async execute(message, args){ 
        let format = { format: "png", dynamic: true, size: 2048 };
        let argString = common.ArgsToString(args);
        let target;

        if (!argString){
            target = message.member;
        } else {
            target = await common.findMember(argString, message);
            if (!target) return message.reply("Couldn't find desired user!");
        }

        const pfpEmbed = new Discord.MessageEmbed()
        .setColor('#803d8f')
        .setAuthor(`${target.displayName}'s pfp`)
        .setImage(target.user.avatarURL(format))
        .setFooter(`Called by ${message.author.tag}`)
        .setTimestamp()

        message.channel.send({embeds: [pfpEmbed]});
    }
}