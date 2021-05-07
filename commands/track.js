const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "track",
    description: "util to track words",
    usage: `\`${process.env.PREFIX}track\``,
    category: "Admin",
    alias: ["track"],
    disabled: true,
    execute(message){ 
        message.reply(" track called!");
    }
}