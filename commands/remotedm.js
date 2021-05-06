const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "remotedm",
    description: "dms a user from the bot",
    usage: `\`${process.env.PREFIX}remotedm\``,
    category: "Admin",
    alias: ["remotedm", "dm"],
    disabled: false,
    execute(message, args){ 
        if (!(message.author.id == process.env.OWNERID)){
            message.reply(" you don't have the permission to call this!");
            common.logerror(message, this.name, "invalid permision");
            return;
        }

        if(!args) return message.reply(" specify a target!");
        let target = common.GetUserID(args.shift(), message);
        if(!target) return message.reply(" couldn't find target!");

        let str = args.join(' ');
        target.send(str);
    }
}