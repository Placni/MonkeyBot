module.exports = {
    name: "reload",
    description: "reloads command",
    usage: `\`${process.env.PREFIX}reload <comname>\``,
    category: "Admin",
    alias: ["rl"],
    disabled: false,
    async execute(message, args, client){ 
        if(message.author.id !== process.env.OWNERID) return message.reply(' you must be the owner to use this!');

        if(!args[0]) return message.reply(' specify a command!');
        let command = args[0];

        try {
            delete require.cache[require.resolve(`./${command}.js`)]
            client.commands.delete(command);
            const pull = require(`./${command}.js`);
            client.commands.set(command, pull);
            return message.channel.send(`**${command}.js** was reloaded!`);
        } catch (err) {
            return message.channel.send(`Error trying to reload **${command}.js**:\n \`${err.message}\``);
        }
    }
}