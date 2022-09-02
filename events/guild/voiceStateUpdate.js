const track = require('@features/track');

module.exports = async (Discord, client, oldState, newState) => {
    if(!oldState.member.user.bot){
        if(!oldState.channel) track.trackVCTime(oldState, 1);
        if(!newState.channel) track.trackVCTime(newState, 0);
    }
};