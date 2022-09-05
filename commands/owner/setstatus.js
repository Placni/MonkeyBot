module.exports = {
    name: "setstatus",
    description: "Sets the status of the bot",
    usage: `\`${process.env.PREFIX}setstatus "<type> <message>"\``,
    alias: ["status"],
    disabled: false,
    execute(message, args, client) {
        if (message.author.id !== process.env.OWNERID) return;

        if(!args.length) return message.reply({ content: 'Specify a status type!' });
        const type = args.shift();
        if(!args.length) return message.reply({ content: 'Specify a status string!' });
        const str = args.join(' ');

        client.user.setActivity(str, { type: type.toUpperCase() })
            .catch(error => {
                message.reply(error.message);
            });
    }
};