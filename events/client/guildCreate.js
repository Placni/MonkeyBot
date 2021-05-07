const guildSettings = require('../../schema/guildSchema');

module.exports = async(Discord, client, guild) => {
    let profile = await guildSettings.create({
        _id: guild.id,
        prefix: '-',
    });
    profile.save();
}