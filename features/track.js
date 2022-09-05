const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "track",
    cache: { voice: {} },
    async trackWords(message, words) {
        const userdata = await dbhelper.getGuildUserProfile(message.guildId, message.author.id);
        if(!userdata.trackers) userdata.trackers = {};
        const trackers = userdata.trackers;
        words.forEach(e => {
            let occurences = (message.content.toLowerCase().split(e).length - 1);
            if (occurences > 5) occurences = 5;
            trackers[e] = (!trackers[e]) ? occurences : trackers[e] + occurences;
        });
        await dbhelper.updateUserProfile(message.guildId, `userinfo.${message.author.id}.trackers`, trackers);
    },
    async trackMessages(message) {
        const userdata = await dbhelper.getGuildUserProfile(message.guildId, message.author.id);
        if(!userdata.msgCount) userdata.msgCount = 0;
        const msgCount = userdata.msgCount + 1;
        await dbhelper.updateUserProfile(message.guildId, `userinfo.${message.author.id}.msgCount`, msgCount);
    },
    async trackVCTime(voiceState, joined) {
        const userId = voiceState.id;
        const guildId = voiceState.member.guild.id;
        if(joined) {
            (!this.cache.voice[guildId])
                ? this.cache.voice[guildId] = { [userId]: Date.now() }
                : this.cache.voice[guildId][userId] = Date.now();
            return;
        } else {
            if(!this.cache.voice[guildId][userId]) return console.log('bruh');
            const joinTime = this.cache.voice[guildId][userId];
            const diff = Math.floor((Date.now() - joinTime) / 1000);
            const userdata = await dbhelper.getGuildUserProfile(guildId, userId);
            const total = !userdata.vcTime ? diff : userdata.vcTime + diff;
            dbhelper.updateUserProfile(guildId, `userinfo.${userId}.vcTime`, total);
        }
    },
    async trackNicknames(oldMember) {
        const { displayName, guildId, id } = oldMember;
        const userdata = await dbhelper.getGuildUserProfile(guildId, id);
        const nicknames = !userdata.nicknames ? [] : userdata.nicknames;
        nicknames.push(displayName);
        if(nicknames.length > 4) nicknames.shift();
        userdata.nicknames = nicknames;
        await dbhelper.updateUserProfile(guildId, `userinfo.${id}.nicknames`, nicknames);
    }
};