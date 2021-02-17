const common = require('../common');
const Discord = require('discord.js');

module.exports = {
    name: "ping",
    description: "responds with latency measurements",
    usage: `\`${process.env.PREFIX}ping\``,
    category: "Utils",
    alias: ["ping", "latency"],
    disabled: false,
    execute(message, args){
        let client = message.client;
        message.channel.send(`🏓 Pong! \nLatency is **${Date.now() - message.createdTimestamp}ms** \nAPI Latency is **${Math.round(client.ws.ping)}ms**`);
    }
}