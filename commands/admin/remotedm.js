const { findMember } = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "remotedm",
    description: "dms a user from the bot",
    usage: `\`${process.env.PREFIX}remotedm\``,
    alias: ["dm"],
    disabled: false,
    async execute(message, args){ 
        if (message.author.id !== process.env.OWNERID) return message.reply(" you must be the owner to use this!");

        if(!args) return message.reply(" specify a target!");
        let target = await findMember(args.shift(), message);
        if(!target) return message.reply(" couldn't find target!");

        let str = args.join(' ');
        target.user.send({content: str});
    }
}