const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "trackword",
    description: "add a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <word>\``,
    category: "Admin",
    alias: ["trackword"],
    disabled: false,
    execute(message){ 
        message.reply(" track called!");
    }
}