const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, member) => {

    const guildID = member.guild.id;
    const userID = member.id;
    userdata = {};
    await dbhelper.updateUserProfile(guildID, `userinfo.${userID}`, userdata);

};