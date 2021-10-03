const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "setdisplayname",
    description: "sets the display name of the bot",
    usage: `\`${process.env.PREFIX}setdisplayname "<name>"\``,
    category: "Admin",
    alias: ["displayname", "username", "name"],
    disabled: false,
    execute(message, args){
        if (message.author.id !== process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            return;
        }

        let client = message.client;
        let newName = args.join(" ");

        client.user
            .setUsername(newName)
            .then(common.logsuccess(message, this.name, `newName: ${newName}`))
            .catch(error => {
                message.reply(error.message);
            });
    }
}