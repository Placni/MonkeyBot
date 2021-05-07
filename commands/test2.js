const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('../schema/guildSchema');

module.exports = {
    name: "test2",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test2\``,
    category: "Admin",
    alias: ["test2"],
    disabled: false,
    cache: {},
    async execute(message, args, client){ 
        
        
    }
}