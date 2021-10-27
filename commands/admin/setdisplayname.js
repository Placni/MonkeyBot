const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "setdisplayname",
    description: "sets the display name of the bot",
    usage: `\`${process.env.PREFIX}setdisplayname "<name>"\``,
    alias: ["displayname", "username", "name"],
    disabled: false,
    execute(message, args, client){
        if (message.author.id !== process.env.OWNERID) return message.reply(" you must be the owner to call this!");
        
        let newName = args.join(" ");
        client.user
            .setUsername(newName)
            .catch(error => {
                message.reply(error.message);
            });
    }
}