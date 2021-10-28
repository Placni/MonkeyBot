const dbhelper = require('@util/dbhelper');

module.exports = async (Discord, client, oldMember, newMember) => {
    if (oldMember.displayName == newMember.displayName) return;

    let oldNick = oldMember.displayName;
    let guildID = oldMember.guild.id;
    let userID = oldMember.id
    let userdata = await dbhelper.getGuildUserProfile(guildID, userID);
    let nicknames = !userdata.nicknames ? [] : userdata.nicknames;
    nicknames.push(oldNick);
    if(nicknames.length > 4) nicknames.shift();
    userdata.nicknames = nicknames;
    await dbhelper.updateUserProfile(guildID, `userinfo.${userID}.nicknames`, nicknames);
};