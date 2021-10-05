const common = require('@util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "test2",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test2\``,
    alias: ["test2"],
    disabled: false,
    async execute(message, args, client){ 
        if(message.author.id !== process.env.OWNERID) return message.reply(' you must be the owner to use this!');

    }
}