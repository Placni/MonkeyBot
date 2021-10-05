const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "trackword",
    description: "add or delete a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <add/delete/clear> <word>\``,
    alias: ["trackword"],
    disabled: false,
    permission: ['MANAGE_MESSAGES'],
    async execute(message, args){ 
        
        let words;
        switch (args[0]){
            case "add":
                args.shift();
                words = await this.wordCheck(message)
                if(args.some(item => words.includes(item))) return message.reply(` you are already tracking that word!`);
                words = words.concat(args);
                await updateWords(words);
                return message.reply(wordsEmbed(dbhelper.globalCache[message.guild.id].trackedwords));
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
                } else return message.reply(wordsEmbed(dbhelper.globalCache[message.guild.id].trackedwords));
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
                    } else return message.reply(wordsEmbed(dbhelper.globalCache[message.guild.id].trackedwords));
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
            .setFooter(`Use \`${dbhelper.globalCache[message.guild.id].prefix}leaderboard {word}\` to check the leaderboards`)
            return wordsEmbed;
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