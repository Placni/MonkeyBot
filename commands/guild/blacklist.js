const common = require('@util/common');
const Discord = require('discord.js');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "blacklist",
    description: "blacklist a user from using the bot in your server",
    usage: `\`${process.env.PREFIX}blacklist <user>\``,
    category: "GuildSettings",
    alias: ["bl"],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args){ 
        if(message.author.id !== message.guild.ownerID) return message.reply(' you must be the server owner to use this!');
        if(!args.length){
            await dbhelper.getGuildSettings(message);
            let blacklist = dbhelper.globalCache[message.guild.id].blacklist
            if(!blacklist.length) return message.reply(' no one is blacklisted in this server!');
            return message.channel.send(blEmbed(blacklist));
        }
        let target = common.GetUserID(args[0], message);
        if(!target) return message.reply(' couldnt find desired user!');

        if(!dbhelper.globalCache[message.guild.id]) await dbhelper.getGuildSettings(message);
        if(!dbhelper.globalCache[message.guild.id].blacklist){
            dbhelper.globalCache[message.guild.id].blacklist = [target];
            await UpdateDB([target]);
            return message.channel.send(`<@${target.user.id}> has been added to the blacklist`);
        }
        let blacklist = dbhelper.globalCache[message.guild.id].blacklist
        if(blacklist.includes(target.user.id)){
            let newlist = blacklist.filter(e => e !== target.user.id);
            dbhelper.globalCache[message.guild.id].blacklist = newlist;
            await UpdateDB(newlist);
            return message.channel.send(`<@${target.user.id}> has been removed from the blacklist`);
        } else {
            blacklist.push(target.user.id);
            dbhelper.globalCache[message.guild.id].blacklist = blacklist;
            await UpdateDB(blacklist);
            return message.channel.send(`<@${target.user.id}> has been added to the blacklist`);
        }

        function blEmbed(list){
            let users = [];
            list.forEach(e => {
                users.push(`<@${e}>`);
            });
            users.join(`\n`);
            const blEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .addField('​**Current Blacklist:**', users)
            return blEmbed;
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