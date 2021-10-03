const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "remotedm",
    description: "dms a user from the bot",
    usage: `\`${process.env.PREFIX}remotedm\``,
    category: "Admin",
    alias: ["dm"],
    disabled: false,
    execute(message, args){ 
        if (message.author.id !== process.env.OWNERID) return message.reply(" you must be the owner to use this!");

        if(!args) return message.reply(" specify a target!");
        let target = common.GetUserID(args.shift(), message);
        if(!target) return message.reply(" couldn't find target!");

        let str = args.join(' ');
        target.send(str);
    }
}