const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "purge",
    description: "purges messages from the chat",
    usage: `\`${process.env.PREFIX}purge <value>\``,
    alias: ["clear"],
    disabled: false,
    permission: ['MANAGE_MESSAGES'],
    async execute(message, args){ 
        let count = args[0];
        if(!count) return message.reply(" please specify an amount!");
        if(isNaN(count) || (count < 1)) return message.reply("Enter a valid number!");
        count = Math.ceil(count) > 100 ? 100 : Math.ceil(count);

        await message.channel.messages.fetch({limit: count}).then(messages =>{
            message.channel.bulkDelete(messages).then(message.channel.send(`Purged **${count}** messages!`))
        });
    }
}