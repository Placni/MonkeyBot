const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');
const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "trackword",
    description: "add or delete a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <add/delete/clear> <word>\``,
    category: "GuildSettings",
    alias: ["trackword"],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args){ 
        
        let words;
        switch (args[0]){
            case "add":
                args.shift();
                words = await this.wordCheck(message)
                if(args.some(item => words.includes(item))) return message.reply(` you are already tracking that word!`);
                words = words.concat(args);
                await updateWords(words);
                return message.reply(` you are now tracking **${dbhelper.globalCache[message.guild.id].trackedwords.join(', ')}**`);
            break;
            case "del":
            case "delete":
                args.shift();
                words = await this.wordCheck(message);
                if(!args.some(item => words.includes(item))) return message.reply(` you aren't tracking that word!`);
                args.forEach(element => {
                    words = words.filter(e => e !== element);
                });
                await updateWords(words);
                if(!dbhelper.globalCache[message.guild.id].trackedwords.length){
                    return message.reply(` your server is currently not tracking any words!`);
                } else return message.reply(` you are now tracking **${dbhelper.globalCache[message.guild.id].trackedwords.join(', ')}**`);
            break;
            case "clear":
                words = [];
                await updateWords(words);
                return message.reply(` your server is no longer tracking any words!`);
            break;
            default:
                await this.wordCheck(message).then(words => {
                    if(!words.length){
                        return message.reply(` your server is not tracking any words!`);
                    } else return message.reply(` your server is tracking: **${words.join(', ')}**`);
                })
                return;
            break;
        }
        async function updateWords(words){
            dbhelper.globalCache[message.guild.id].trackedwords = words;
            await guildSettings.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    trackedwords: words
                },
            )
        }
    },

    async wordCheck(message){
        let words;
        if (!dbhelper.globalCache[message.guild.id]){
            await dbhelper.getGuildSettings(message);
            return words = dbhelper.globalCache[message.guild.id].trackedwords;
        } else {
            return words = dbhelper.globalCache[message.guild.id].trackedwords;
        }
    }
}