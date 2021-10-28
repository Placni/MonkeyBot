const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "trackword",
    description: "add or delete a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <add/delete/clear> <word>\``,
    alias: [],
    disabled: false,
    permission: ['MANAGE_MESSAGES'],
    async execute(message, args){ 
        let words;
        let guildID = message.guild.id;
        switch (args[0]){
            case "add":
                args.shift();
                words = await this.wordCheck(guildID)
                if(args.some(item => words.includes(item))) return message.reply(` you are already tracking that word!`);
                words = words.concat(args);
                await updateWords(words);
                return message.reply(wordsEmbed(dbhelper.globalCache[guildID].trackedwords));
            break;
            case "del":
            case "delete":
                args.shift();
                words = await this.wordCheck(guildID);
                if(!args.some(item => words.includes(item))) return message.reply(` you aren't tracking that word!`);
                args.forEach(element => {
                    words = words.filter(e => e !== element);
                });
                await updateWords(words);
                if(!dbhelper.globalCache[guildID].trackedwords.length){
                    return message.reply(` your server is currently not tracking any words!`);
                } else return message.reply(wordsEmbed(dbhelper.globalCache[guildID].trackedwords));
            break;
            case "clear":
                words = [];
                await updateWords(words);
                return message.reply(` your server is no longer tracking any words!`);
            break;
            default:
                await this.wordCheck(guildID).then(words => {
                    if(!words.length){
                        return message.reply(` your server is not tracking any words!`);
                    } else return message.reply(wordsEmbed(dbhelper.globalCache[guildID].trackedwords));
                })
                return;
            break;
        }

        function wordsEmbed(list){
            let words = list.join(`\n`);
            const wordsEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor("Currently Tracking:", message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .addField(words, '\u200b')
            .setFooter(`Use \`${dbhelper.globalCache[guildID].prefix}leaderboard {word}\` to check the leaderboards`)
            return wordsEmbed;
        }

        async function updateWords(words){
            dbhelper.globalCache[guildID].trackedwords = words;
            await guildSettings.findOneAndUpdate({ _id: guildID }, { trackedwords: words });
        }
    },

    async wordCheck(guildID){
        let words;
        if (!dbhelper.globalCache[guildID]){
            await dbhelper.getGuildSettings(guildID);
            return words = dbhelper.globalCache[guildID].trackedwords;
        } else {
            return words = dbhelper.globalCache[guildID].trackedwords;
        }
    }
}