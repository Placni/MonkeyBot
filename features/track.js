const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "track",
    cache: { voice: {} },
    async trackWords(message, words){ 
        let userdata = await dbhelper.getGuildUserProfile(message.guildId, message.author.id);
        if(!userdata.trackers) userdata.trackers = {};
        let trackers = userdata.trackers;
        words.forEach(e => {
            let occurences = (message.content.toLowerCase().split(e).length - 1);
            if (occurences > 5) occurences = 5;
            if (!trackers[e]){
                trackers[e] = occurences;
            } else trackers[e] += occurences;
        });
        await dbhelper.updateUserProfile(message.guildId, `userinfo.${message.author.id}.trackers`, trackers);
    },
    async trackMessages(message){
        let userdata = await dbhelper.getGuildUserProfile(message.guildId, message.author.id);
        if(!userdata.msgCount) userdata.msgCount = 0;
        let msgCount = userdata.msgCount;
        msgCount++;
        await dbhelper.updateUserProfile(message.guildId, `userinfo.${message.author.id}.msgCount`, msgCount);
    },
    async trackVCTime(voiceState, joined){
        let userId = voiceState.id;
        let guildId = voiceState.member.guild.id;
        if(joined){
            if(!this.cache.voice[guildId]){
                this.cache.voice[guildId] = {[userId]: Date.now()};
                return;
            } else this.cache.voice[guildId][userId] = Date.now();
        } else {
            console.log(this.cache);
            if(!this.cache.voice[guildId][userId]) return console.log('bruh');
            let joinTime = this.cache.voice[guildId][userId];
            let diff = Math.floor((Date.now() - joinTime) / 1000);
            let userdata = await dbhelper.getGuildUserProfile(guildId, userId);
            let total = !userdata.vcTime ? diff : userdata.vcTime + diff;
            dbhelper.updateUserProfile(guildId, `userinfo.${userId}.vcTime`, total)
        }
    },
    async trackNicknames(oldMember){
        let oldNick = oldMember.displayName;
        let guildId = oldMember.guildId;
        let userId = oldMember.id
        let userdata = await dbhelper.getGuildUserProfile(guildId, userId);
        let nicknames = !userdata.nicknames ? [] : userdata.nicknames;
        nicknames.push(oldNick);
        if(nicknames.length > 4) nicknames.shift();
        userdata.nicknames = nicknames;
        await dbhelper.updateUserProfile(guildId, `userinfo.${userId}.nicknames`, nicknames);
    }
}