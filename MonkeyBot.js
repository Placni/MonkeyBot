const Discord = require('discord.js');
require("module-alias/register");
require('log-timestamp');
require('dotenv').config();

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_VOICE_STATES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
    ],
    failIfNotExists: false,
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.features = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler =>{
    require(`./handlers/${handler}`)(client, Discord);
})

client.login(process.env.TOKEN);