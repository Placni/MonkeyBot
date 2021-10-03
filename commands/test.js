const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');

module.exports = {
    name: "test",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Admin",
    alias: ["test"],
    disabled: false,
    async execute(message, args, client){ 
        
    }
}