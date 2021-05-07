const dbhelper = require('../../util/dbhelper');
const guildSettings = require('../../schema/guildSchema');

module.exports = async(Discord, client, guild) => {
    let settings = await guildSettings.create({
        _id: guild.id,
        prefix: '-',
        trackedwords: [],
        userinfo: {placeholder: "placeholder"},
    })
    settings.save();
    dbhelper.globalCache[guild.id] = settings;
}