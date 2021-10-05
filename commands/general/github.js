const Discord = require('discord.js');

module.exports = {
    name: "github",
    description: "check out monkeybot on github!",
    usage: `\`${process.env.PREFIX}github\``,
    alias: ["git"],
    disabled: false,
    execute(message, args){ 
        const gitInfo = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`MonkeyBot`)
            .setThumbnail('https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png')
            .setTitle('Check me out on github!')
            .setURL('https://github.com/Placni/MonkeyBot/tree/main')
        
        message.channel.send(gitInfo);
    }
}