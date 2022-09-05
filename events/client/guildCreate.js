const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, guild) => {
    await dbhelper.getGuildSettings(guild.id);
};