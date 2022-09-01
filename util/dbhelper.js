const guildSettings = require('@schema/guildSchema');

module.exports = {
    globalCache: {},
    async getGuildSettings(guildId) {
        if(!(guildId in this.globalCache)){
            let settings = await guildSettings.findOne({_id: guildId});
            if(!settings){
                settings = await guildSettings.create({ _id: guildId });
                settings.userinfo = {};
                settings.save();
            }
            this.globalCache[guildId] = settings;
            return this.globalCache[guildId];
        } else return this.globalCache[guildId];
    },

    async getGuildUserProfile(guildId, userId) {
        let userdata;
        if(!(guildId in this.globalCache)) await this.getGuildSettings(guildId);
        if(!(userId in this.globalCache[guildId].userinfo)){
            this.globalCache[guildId].userinfo[userId] = {};
            let path = `userinfo.${userId}`;
            await guildSettings.findOneAndUpdate({_id: guildId}, { [path]: {}});
            return userdata = this.globalCache[guildId].userinfo[userId];
        } else return userdata = this.globalCache[guildId].userinfo[userId];
    },

    async updateUserProfile(guildId, path, data) {
        let newdat = await guildSettings.findOneAndUpdate({ _id: guildId }, { [path]: data }, {new: true})
        this.globalCache[guildId] = newdat;
    }
}