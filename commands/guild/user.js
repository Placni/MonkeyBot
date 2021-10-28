const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "user",
    description: "display user information",
    usage: `\`${process.env.PREFIX}user <target>\``,
    alias: [],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args, client){ 
        
    }
}