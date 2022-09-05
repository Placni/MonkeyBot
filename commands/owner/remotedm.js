const { findMember } = require('@util/common');

module.exports = {
    name: "remotedm",
    description: "DMs a user from the bot",
    usage: `\`${process.env.PREFIX}remotedm <message>\``,
    alias: ["dm"],
    disabled: false,
    async execute(message, args) {
        if (message.author.id !== process.env.OWNERID) return;

        if(!args) return message.reply({ content: "Specify a target!" });
        const target = await findMember(args.shift(), message);
        if(!target) return message.reply({ content: "Couldn't find target!" });

        const str = args.join(' ');
        try{
            await target.user.send({ content: str });
            return message.reply({ content: "Message sent successfully" });
        } catch(e) {
            return message.reply({ content: 'An error occured\nUser may have DMs turned off' });
        }
    }
};