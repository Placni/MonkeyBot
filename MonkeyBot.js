const Discord = require('discord.js');
const mongo = require('./util/mongo.js');
const colors = require('colors');
const fs = require('fs');
require('log-timestamp');
require('dotenv').config();
const mongoose = require('mongoose');

const prefix = process.env.PREFIX;
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')); 
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log('MonkeyBot Online' .magenta);
    await mongo().then(mongoose => {
        console.log('Connected to Mongo' .green);
    })
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    for (c of client.commands) {
        if (command == c[0] || (c[1].alias !== undefined && Object.values(c[1].alias).includes(command))) {
            if (c[1].disabled == true) {
                message.reply(" that command is disabled");
                return;
            } else {
                client.commands.get(c[0]).execute(message, args);
            }
        }
    }
});

client.login(process.env.TOKEN);