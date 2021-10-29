const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, member) => {

    let guildID = member.guild.id;
    let userID = member.id;
    let userdata = await dbhelper.getGuildUserProfile(guildID, userID);
    userdata = {};
    await dbhelper.updateUserProfile(guildID, `userinfo.${userID}`, userdata);

};