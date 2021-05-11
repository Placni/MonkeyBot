const Discord = require('discord.js');

module.exports = {
    name: "lmgtfy",
    description: "let me google that for you",
    usage: `\`${process.env.PREFIX}lmgtfy <text>\``,
    category: "General",
    alias: ["lmgtfy"],
    disabled: false,
    execute(message, args){ 
        if(!args.length) return message.reply(" specify something to google!");
        const toSend = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setTitle('For the idiot')
            .setURL(`https://letmegooglethat.com/?q=${args.join('+')}`)
        message.channel.send(toSend);
    }
}