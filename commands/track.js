const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');
const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "track",
    description: "util to track words",
    usage: `\`${process.env.PREFIX}track\``,
    category: "Admin",
    alias: [],
    disabled: true,
    cache: {},
    async execute(message, client, words){ 
        //TODO: find out how to query mongoose for a specific object instead of pushing all the info at once

        let userdata = await dbhelper.getGuildUserProfile(message, words);
        words.forEach(element => {
            let occurences = (message.content.split(element).length - 1);
            if (occurences > 5) occurences = 5;
            if (!userdata.trackers[element]){
                userdata.trackers[element] = occurences;
            } else userdata.trackers[element] += occurences;
        });
        dbhelper.globalCache[message.guild.id].userinfo[message.author.id] = userdata;
        await guildSettings.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                userinfo: dbhelper.globalCache[message.guild.id].userinfo,
            }
        );
    },
}