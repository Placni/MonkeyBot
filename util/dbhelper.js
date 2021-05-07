const guildSettings = require('../schema/guildSchema');

module.exports = {
    globalCache: {},
    async getGuildSettings(message) {
        if(!this.globalCache[message.guild.id]){
            let settings = await guildSettings.findOne({ _id: message.guild.id });
            if(!settings){
                settings = await guildSettings.create({
                    _id: message.guild.id,
                    prefix: '-',
                    trackedwords: [],
                    userinfo: {placeholder: 'placeholder'},
                })
                settings.save();
            }
            this.globalCache[message.guild.id] = settings;
            return this.globalCache[message.guild.id];
        } else return this.globalCache[message.guild.id];
    },

    async getGuildUserProfile(message, words) {
        let userdata
        if(!this.globalCache[message.guild.id].userinfo[message.author.id]){
            let trackers = {};
            words.forEach(element => {
                trackers[element] = 0;
            });
            this.globalCache[message.guild.id].userinfo[message.author.id] = {trackers: trackers}
            await guildSettings.findOneAndUpdate(
                {
                    _id: message.guild.id,
                },
                {
                    userinfo: this.globalCache[message.guild.id].userinfo,
                },
            )
            return userdata = this.globalCache[message.guild.id].userinfo[message.author.id];
        } else return userdata = this.globalCache[message.guild.id].userinfo[message.author.id];
    }
}