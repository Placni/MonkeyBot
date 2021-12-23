const dbhelper = require('@util/dbhelper');
const track = require('@features/track');

module.exports = async (Discord, client, message) => {
    if(!message.guild || message.author.bot) return;
    let prefix = await client.commands.get('prefix').prefixCheck(message.guild.id);
    if(!message.content.startsWith(prefix)) {
        track.trackMessages(message);
        let words = await client.commands.get('trackword').wordCheck(message.guild.id);
        if (words.length > 0){
            if (new RegExp(words.join("|")).test(message.content)) {
                track.trackWords(message, client, words);
            }
        } else return;
        return;
    }
    let blacklist = dbhelper.globalCache[message.guild.id].blacklist;
    if(blacklist.includes(message.author.id)) return message.reply(' seems like you have been blacklisted from using me!');
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    for (c of client.commands) {
        if (command == c[0] || (c[1].alias !== undefined && Object.values(c[1].alias).includes(command))) {
            if (c[1].disabled == true) {
                return message.reply(" that command is disabled");
            } else {
                if (c[1].permission == undefined || c[1].permission.some(e => message.member.permissionsIn(message.channel).toArray().includes(e))) {
                    try {
                        client.commands.get(c[0]).execute(message, args, client); 
                    } catch (err) {
                        return console.log(err);
                    }   
                } else return message.reply(`Missing Permission(s): \`${c[1].permission.join(", ")}\``);
            }
        }
    }
}