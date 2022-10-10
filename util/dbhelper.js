const guildSettings = require('@schema/guildSchema');
const destinyTokens = require('@schema/destinySchema').default;

module.exports = {
    globalCache: { destiny: {} },
    async getGuildSettings(guildId) {
        if(!(guildId in this.globalCache)) {
            let settings = await guildSettings.findOne({ _id: guildId });
            if(!settings) {
                settings = await guildSettings.create({ _id: guildId });
                settings.userinfo = {};
                settings.save();
            }
            this.globalCache[guildId] = settings;
            return this.globalCache[guildId];
        }
        return this.globalCache[guildId];
    },

    async getGuildUserProfile(guildId, userId) {
        if(!(guildId in this.globalCache)) await this.getGuildSettings(guildId);
        if(!(userId in this.globalCache[guildId].userinfo)) {
            this.globalCache[guildId].userinfo[userId] = {};
            const path = `userinfo.${userId}`;
            await guildSettings.findOneAndUpdate({ _id: guildId }, { [path]: {} });
            return this.globalCache[guildId].userinfo[userId];
        }
        return this.globalCache[guildId].userinfo[userId];
    },

    async updateUserProfile(guildId, path, data) {
        const newdat = await guildSettings.findOneAndUpdate({ _id: guildId }, { [path]: data }, { new: true });
        this.globalCache[guildId] = newdat;
    },

    async getDestinyTokens(userId) {
        if(!(userId in this.globalCache.destiny)) {
            const data = await destinyTokens.findOne({ _id: userId });
            if(!data) return undefined;
            console.log(this.globalCache);
            return this.globalCache.destiny[userId] = data;
        }
        return this.globalCache.destiny[userId];
    }
};