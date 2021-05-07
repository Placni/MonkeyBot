const colors = require('colors');
const guildSettings = require('../../schema/guildSchema');
let trackedWords = ['loser', 'fag'];

module.exports = async (Discord, client, message) => {
    if(!message.guild) return;
    
    if (new RegExp(trackedWords.join("|")).test(message.content)) {
        console.log(`Match using "${message.content}"`);
        client.commands.get('track').execute(message);
    }
    
  
    client.commands
        .get('prefix')
        .prefixCheck(message)
        .then(prefix =>{
            if(!message.content.startsWith(prefix) || message.author.bot) return;
            const args = message.content.slice(prefix.length).split(/ +/);
            const command = args.shift().toLowerCase();
            for (c of client.commands) {
                if (command == c[0] || (c[1].alias !== undefined && Object.values(c[1].alias).includes(command))) {
                    if (c[1].disabled == true) {
                        message.reply(" that command is disabled");
                        return;
                    } else {
                        try {
                            client.commands.get(c[0]).execute(message, args, client); 
                        } catch (err) {
                            return console.log(err);
                        }
                    }
                }
            }
        });
}