const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "track",
    cache: { voice: {} },
    async trackWords(message, client, words){ 
        let userdata = await dbhelper.getGuildUserProfile(message.guild.id, message.author.id);
        if(!userdata.trackers) userdata.trackers = {};
        let trackers = userdata.trackers;
        words.forEach(element => {
            let occurences = (message.content.split(element).length - 1);
            if (occurences > 5) occurences = 5;
            if (!trackers[element]){
                trackers[element] = occurences;
            } else trackers[element] += occurences;
        });
        await dbhelper.updateUserProfile(message.guild.id, `userinfo.${message.author.id}.trackers`, trackers);
    },
    async trackMessages(message){
        let userdata = await dbhelper.getGuildUserProfile(message.guild.id, message.author.id);
        if(!userdata.msgCount) userdata.msgCount = 0;
        let msgCount = userdata.msgCount;
        msgCount++;
        await dbhelper.updateUserProfile(message.guild.id, `userinfo.${message.author.id}.msgCount`, msgCount);
    },
    async trackVCTime(voiceState, joined){
        let userID = voiceState.id;
        let guildID = voiceState.member.guild.id;
        if(joined){
            if(!this.cache.voice[guildID]){
                this.cache.voice[guildID] = {[userID]: Date.now()};
                return;
            } else this.cache.voice[guildID][userID] = Date.now();
        } else {
            if(!this.cache.hasOwnProperty(userID)) return;
            let joinTime = this.cache.voice[guildID][userID];
            let diff = Math.floor((Date.now() - joinTime) / 1000);
            let userdata = await dbhelper.getGuildUserProfile(guildID, userID);
            let total = !userdata.vcTime ? diff : userdata.vcTime + diff;
            dbhelper.updateUserProfile(guildID, `userinfo.${userID}.vcTime`, total)
        }
    },
    async trackNicknames(oldMember){
        let oldNick = oldMember.displayName;
        let guildID = oldMember.guild.id;
        let userID = oldMember.id
        let userdata = await dbhelper.getGuildUserProfile(guildID, userID);
        let nicknames = !userdata.nicknames ? [] : userdata.nicknames;
        nicknames.push(oldNick);
        if(nicknames.length > 4) nicknames.shift();
        userdata.nicknames = nicknames;
        await dbhelper.updateUserProfile(guildID, `userinfo.${userID}.nicknames`, nicknames);
    }
}