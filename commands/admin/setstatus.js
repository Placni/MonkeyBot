const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "setstatus",
    description: "sets the status of the bot",
    usage: `\`${process.env.PREFIX}setstatus "<type> <message>"\``,
    alias: ["status"],
    disabled: false,
    execute(message, args, client){
        if (message.author.id !== process.env.OWNERID) return message.reply(" you must be the owner to call this!");

        let type = args.shift();
        let str = common.ArgsToString(args);

        client.user.setActivity(str, { type: type.toUpperCase() })
            .catch(error => {
                message.reply(error.message);
            });
    }
}