const dbhelper = require('@util/dbhelper');
const track = require('@features/track');
const { wordCheck } = require('@commands/guild/trackword');
const { prefixCheck } = require('@commands/guild/prefix');

module.exports = async (Discord, client, message) => {
    if(!message.guild || message.author.bot) return;
    let prefix = await prefixCheck(message.guild.id);
    if(!message.content.startsWith(prefix)) {
        track.trackMessages(message);
        let words = await wordCheck(message.guild.id);
        if (words.length){
            if (new RegExp(words.join("|")).test(message.content.toLowerCase())) {
                track.trackWords(message, words);
            }
        } else return;
        return;
    }
    let blacklist = dbhelper.globalCache[message.guild.id].blacklist;
    if(blacklist.includes(message.author.id)) return message.reply(' seems like you have been blacklisted from using me!');
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    for (c of client.commands) {
        if (command == c[0] || (c[1]?.alias !== undefined && Object.values(c[1]?.alias)?.includes(command))) {
            if (c[1].disabled == true) {
                return message.reply("That command is disabled");
            } else {
                if(c[1].permission?.length){
                    const missingPerms = c[1].permission?.filter(perm => !message.member.permissions.has(perm));
                    if (missingPerms.length) {
                        return message.reply({
                            content: `**You are missing permisson(s): ${missingPerms.map(p => `\`${p}\``).join(", ")}**`,});
                    }
                }
                client.commands.get(c[0]).execute(message, args, client).catch(e =>{
                    console.log(e);
                    return message.reply('**An error has occured**');
                })
            }
        }
    }
}