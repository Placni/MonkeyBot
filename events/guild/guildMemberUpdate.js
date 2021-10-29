const track = require('@features/track');

module.exports = async (Discord, client, oldMember, newMember) => {
    if (oldMember.displayName !== newMember.displayName) track.trackNicknames(oldMember);
};