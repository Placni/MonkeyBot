const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "setdisplayname",
    description: "Sets the display name of the bot",
    usage: `\`${process.env.PREFIX}setdisplayname <name>\``,
    alias: ["displayname", "username", "name"],
    disabled: false,
    execute(message, args, client){
        if (message.author.id !== process.env.OWNERID) return;
        
        if(!args.length) return message.reply({ content: 'Specify a display name!' });
        let newName = args.join(" ");
        client.user
            .setUsername(newName)
            .catch(error => {
                message.reply(error.message);
            });
    }
}