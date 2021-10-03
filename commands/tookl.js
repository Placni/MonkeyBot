const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');

module.exports = {
    name: "tookl",
    description: "for when someone takes a fat L",
    usage: `\`${process.env.PREFIX}tookl <user>\``,
    category: "General",
    alias: ["tookl"],
    disabled: false,
    async execute(message, args){ 
        if(!args.length) return message.reply(' specify a user!');

        let target = args.shift();
        target = common.GetUserID(target, message);
        if(!target) return message.reply(' couldnt find target user!');
        
        if(!dbhelper.globalCache[message.guild.id]) await dbhelper.getGuildSettings(message);
        let userdata = await dbhelper.getGuildUserProfile(message, dbhelper.globalCache[message.guild.id].trackedwords, target.user.id);
        if(!userdata.trackers['L']){
            userdata.trackers['L'] = 1;
        } else userdata.trackers['L'] += 1;
        dbhelper.globalCache[message.guild.id].userinfo[target.user.id] = userdata;
        await guildSettings.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                userinfo: dbhelper.globalCache[message.guild.id].userinfo,
            }
        );
        message.channel.send(`<@!${target.user.id}> just took a fat L!`);
    }
}