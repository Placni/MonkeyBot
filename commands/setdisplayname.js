const common = require('../common');
const Discord = require('discord.js');

module.exports = {
    name: "setdisplayname",
    description: "Sets the display name of the bot",
    usage: `\`${process.env.PREFIX}setdisplayname "<name>"\``,
    category: "Admin",
    alias: ["setdisplayname", "displayname", "username"],
    disabled: false,
    execute(message, args){
        let comname = "setdisplayname";
        if (message.author != process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            return;
        }

        let client = message.client;
        let newName = args.shift();

        client.user
            .setUsername(newName)
            .then(common.logsuccess(message, comname, `newName: ${newName}`))
            .catch(error => {
                message.reply(error.message);
            });
    }
}