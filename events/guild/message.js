module.exports = (Discord, client, message) => {
    const prefix = process.env.PREFIX;

    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    for (c of client.commands) {
        if (command == c[0] || (c[1].alias !== undefined && Object.values(c[1].alias).includes(command))) {
            if (c[1].disabled == true) {
                message.reply(" that command is disabled");
                return;
            } else {
                client.commands.get(c[0]).execute(message, args);
            }
        }
    }
}