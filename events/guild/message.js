const colors = require('colors');
const guildSettings = require('../../schema/guildSchema');
const common = require('../../util/common');


module.exports = async (Discord, client, message) => {
    if(!message.guild || message.author.bot) return;

    //TODO:
    //
    //make tracking more efficient (Summer of GOTO?)
    //DONE: implement better permission check
    //implement cooldowns
    //add per role command whitelist?
    //rewrite old messy commands (like move holy shit what was I doing)
    //finish video.js
    //DONE: create common function that caches mongo profile for each guild
    
    let words = await client.commands.get('trackword').wordCheck(message);
    if (words.length > 0){
        if (new RegExp(words.join("|")).test(message.content)) {
            console.log(`Match using "${message.content}"`);
            client.commands.get('track').execute(message, client, words);
        }
    }
    
  
    client.commands
        .get('prefix')
        .prefixCheck(message)
        .then(prefix =>{
            if(!message.content.startsWith(prefix)) return;
            const args = message.content.slice(prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();
            for (c of client.commands) {
                if (command == c[0] || (c[1].alias !== undefined && Object.values(c[1].alias).includes(command))) {
                    if (c[1].disabled == true) {
                        message.reply(" that command is disabled");
                        return;
                    } else {
                        if (c[1].permission == undefined || c[1].permission.some(common.PermissionCheck(message.member, c[1].permission))) {
                            try {
                                client.commands.get(c[0]).execute(message, args, client); 
                            } catch (err) {
                                return console.log(err);
                            }   
                        } else return message.reply(` missing permission: \`${c[1].permission.join(", ")}\``);
                    }
                }
            }
        });
}