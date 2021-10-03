const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "ping",
    description: "responds with latency measurements",
    usage: `\`${process.env.PREFIX}ping\``,
    category: "Utility",
    alias: ["latency"],
    disabled: false,
    async execute(message, args){
        let client = message.client;
        let resMsg = await message.channel.send('Resolving...');
        resMsg.edit(`🏓 Pong! \nLatency is **${Math.round((resMsg.createdTimestamp - message.createdTimestamp) - client.ws.ping)}ms**`);
    }
}