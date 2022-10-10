const dbhelper = require('@util/dbhelper.js');

module.exports = {
    name: "clearcache",
    description: "Force clears the local mongo cache",
    usage: `\`${process.env.PREFIX}clearcache\``,
    disabled: false,
    execute(message) {
        if(message.author.id !== process.env.OWNERID) return;
        dbhelper.globalCache = { destiny: {} };
        return message.reply({ content: '`cache cleared`', ephemeral: true });
    }
};