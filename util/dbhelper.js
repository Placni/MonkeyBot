const guildSettings = require('@schema/guildSchema');

module.exports = {
    globalCache: {},
    async getGuildSettings(message) {
        let guildID = (!message.guild.id) ? message : message.guild.id;
        if(!this.globalCache[guildID]){
            let settings = await guildSettings.findOne({ _id: guildID });
            if(!settings){
                settings = await guildSettings.create({ _id: guildID });
                settings.save();
            }
            this.globalCache[guildID] = settings;
            return this.globalCache[guildID];
        } else return this.globalCache[guildID];
    },

    async getGuildUserProfile(message, words, target) {
        let userdata;
        if(!this.globalCache[message.guild.id].userinfo[target]){
            let trackers = {};
            words.forEach(element => { trackers[element] = 0; });
            this.globalCache[message.guild.id].userinfo[target] = {trackers: trackers}
            await guildSettings.findOneAndUpdate(
                {
                    _id: message.guild.id,
                },
                {
                    userinfo: this.globalCache[message.guild.id].userinfo,
                },
            )
            return userdata = this.globalCache[message.guild.id].userinfo[target];
        } else return userdata = this.globalCache[message.guild.id].userinfo[target];
    }
}