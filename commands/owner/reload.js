module.exports = {
    name: "reload",
    description: "Reloads a command file",
    usage: `\`${process.env.PREFIX}reload <comname>\``,
    alias: ["rl"],
    disabled: false,
    async execute(message, args, client){
        if(message.author.id !== process.env.OWNERID) return;

        if(!args.length) return message.reply({ content: 'Specify a command!' });
        const com = args[0];
        try {
            let category = client.commands.get(com).category;
            delete require.cache[require.resolve(`@commands/${category}/${com}.js`)]
            client.commands.delete(com);
            const pull = require(`@commands/${category}/${com}.js`);
            pull.category = category;
            client.commands.set(com, pull);
            return message.channel.send(`**${com}.js** was reloaded!`);
        } catch (err) {
            return message.channel.send(`Error trying to reload **${com}.js**:\n \`${err.message}\``);
        }
    }
}