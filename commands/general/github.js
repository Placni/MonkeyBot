const Discord = require('discord.js');

module.exports = {
    name: "github",
    description: "check out monkeybot on github!",
    usage: `\`${process.env.PREFIX}github\``,
    alias: ["git"],
    disabled: false,
    execute(message, args, client){ 
        const gitInfo = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`Monkeybot`, client.user.avatarURL())
            .setThumbnail('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')
            .setTitle('Check me out on github!')
            .setURL('https://github.com/Placni/MonkeyBot/tree/main')
            .setFooter('Made with <3 by Myssto#0001')
        
        message.channel.send(gitInfo);
    }
}