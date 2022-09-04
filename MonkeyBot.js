const Discord = require('discord.js');
require("module-alias/register");
require('log-timestamp');
require('dotenv').config();

const { GatewayIntentBits } = Discord;
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
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