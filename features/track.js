const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "track",
    description: "util to track words",
    usage: `\`${process.env.PREFIX}track\``,
    alias: [],
    async execute(message, client, words){ 
        let userdata = await dbhelper.getGuildUserProfile(message, words, message.author.id);
        if(!userdata.trackers) userdata.trackers = {};
        let trackers = userdata.trackers;
        words.forEach(element => {
            let occurences = (message.content.split(element).length - 1);
            if (occurences > 5) occurences = 5;
            if (!trackers[element]){
                trackers[element] = occurences;
            } else trackers[element] += occurences;
        });
        dbhelper.globalCache[message.guild.id].userinfo[message.author.id].trackers = trackers;
        let path = `userinfo.${message.author.id}.trackers`;
        await guildSettings.findOneAndUpdate({ _id: message.guild.id }, { [path]: trackers });
    },
}