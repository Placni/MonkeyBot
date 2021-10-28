const guildSettings = require('@schema/guildSchema');

module.exports = {
    globalCache: {},
    async getGuildSettings(message) {
        let guildID = (!message.guild.id) ? message : message.guild.id;
        if(!this.globalCache[guildID]){
            let settings = await guildSettings.findOne({_id: guildID});
            if(!settings){
                settings = await guildSettings.create({ _id: guildID });
                settings.userinfo = {};
                settings.save();
            }
            this.globalCache[guildID] = settings;
            return this.globalCache[guildID];
        } else return this.globalCache[guildID];
    },

    async getGuildUserProfile(message, words, target) {
        let userdata;
        let guildID = (!message.guild.id) ? message : message.guild.id;
        if(!this.globalCache[guildID].userinfo[target]){
            this.globalCache[guildID].userinfo[target] = {};
            let path = `userinfo.${target}`;
            await guildSettings.findOneAndUpdate({_id: guildID}, { [path]: {}});
            return userdata = this.globalCache[guildID].userinfo[target];
        } else return userdata = this.globalCache[guildID].userinfo[target];
    }
}