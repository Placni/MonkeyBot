const Discord = require('discord.js');
const dbhelper = require('@util/dbhelper.js');

module.exports = {
    name: "clearcache",
    description: "force clears the mongo cache",
    usage: `\`${process.env.PREFIX}clearcache\``,
    category: "Admin",
    alias: ["clearcache"],
    disabled: false,
    async execute(message, args, client){ 
        if(message.author.id !== process.env.OWNERID) return message.reply(' you must be the owner to use this!');

        dbhelper.globalCache = {};
        message.channel.send('`cache cleared`');
    }
}