const common = require('../common');
const Discord = require('discord.js');

module.exports = {
    name: "setstatus",
    description: "Sets the status of the bot",
    usage: `\`${process.env.PREFIX}setstatus "<type> <message>"\``,
    category: "Admin",
    alias: ["setstatus", "status"],
    disabled: false,
    execute(message, args){
        if (message.author != process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            return;
        }

        let client = message.client;
        let type = args.shift();
        let str = common.ArgsToString(args);

        client.user.setActivity(str, { type: type.toUpperCase() })
            .then(common.logsuccess(message, this.name, `type = ${type} string = ${str}`))
            .catch(error => {
                message.reply(error.message);
            });
    }
}