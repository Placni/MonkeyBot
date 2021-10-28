const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, oldMember, newMember) => {

    let guildID = oldMember.guild.id;
    let userID = oldMember.id
    let userdata = await dbhelper.getGuildUserProfile(guildID, userID);
    console.log(userdata);

};