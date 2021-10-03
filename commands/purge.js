const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "purge",
    description: "purges messages from the chat",
    usage: `\`${process.env.PREFIX}purge <value>\``,
    category: "Utility",
    alias: ["clear"],
    disabled: false,
    permission: ['MANAGE_MESSAGES'],
    async execute(message, args){ 
        if(!args[0]) return message.reply(" please specify an amount!");
        if(isNaN(args[0]) || (args[0] < 1)) return message.reply(" please enter a valid number!");
        if(args[0] > 100) return message.reply(" I can only clear 100 messages at a time!");

        await message.channel.messages.fetch({limit: args[0]}).then(messages =>{
            message.channel.bulkDelete(messages).then(message.reply(` purged **${args[0]}** messages!`)).then(common.logsuccess(message, this.name, `purged ${args[0]} message(s)`));
        });
    }
}