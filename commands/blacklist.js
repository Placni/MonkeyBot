const common = require('../util/common');
const Discord = require('discord.js');
const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');

module.exports = {
    name: "blacklist",
    description: "blacklist a user from using the bot in your server",
    usage: `\`${process.env.PREFIX}blacklist <user>\``,
    category: "GuildSettings",
    alias: ["bl"],
    disabled: false,
    async execute(message, args){ 
        if(message.author.id !== process.env.OWNERID) return message.reply(' you must be the owner to use this!');
        if(!args.length){
            await dbhelper.getGuildSettings(message);
            let blacklist = dbhelper.globalCache[message.guild.id].blacklist
            if(!blacklist.length) return message.reply(' no one is blacklisted in this server!');
            let str = ``;
            blacklist.forEach(element => {
                str += `**${element}**, `
            });
            return message.channel.send(`**${message.guild.name}** is currently blacklisting: ${str}`);
        }
        let target = common.GetUserID(args[0], message);
        if(!target) return message.reply(' couldnt find desired user!');

        if(!dbhelper.globalCache[message.guild.id]) await dbhelper.getGuildSettings(message);
        if(!dbhelper.globalCache[message.guild.id].blacklist){
            dbhelper.globalCache[message.guild.id].blacklist = [target];
            await UpdateDB([target]);
            return message.channel.send(`**${target.user.tag}** has been added to the blacklist`);
        }
        let blacklist = dbhelper.globalCache[message.guild.id].blacklist
        if(blacklist.includes(target.user.id)){
            let newlist = blacklist.filter(e => e !== target.user.id);
            dbhelper.globalCache[message.guild.id].blacklist = newlist;
            await UpdateDB(newlist);
            return message.channel.send(`**${target.user.tag}** has been removed from the blacklist`);
        } else {
            blacklist.push(target.user.id);
            dbhelper.globalCache[message.guild.id].blacklist = blacklist;
            await UpdateDB(blacklist);
            return message.channel.send(`**${target.user.tag}** has been added to the blacklist`);
        }

        async function UpdateDB(list){
            await guildSettings.findOneAndUpdate(
                {
                    _id: message.guild.id
                },
                {
                    blacklist: list
                },
            );
        }
    }
}