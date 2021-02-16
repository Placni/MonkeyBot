const Discord = require('discord.js');
const client = new Discord.Client();
const colors = require('colors');
const fs = require('fs');
require('log-timestamp');
require('dotenv').config();

var auth = require('./auth.json');
var package = require('./package.json');

const prefix = process.env.PREFIX;

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js')); 
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('MonkeyBot Online' .rainbow);
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;
 
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
 
    if(command === 'getpfp'){
        client.commands.get('getpfp').execute(message, args, client);
    } else if(command === 'setup'){
        client.commands.get('setup').execute(message);
    } else if(command === 'bal'){
        client.commands.get('bal').execute(message, args);
    } else if(command === 'coinflip'){
        client.commands.get('coinflip').execute(message, args);
    } else if(command === 'help'){
        client.commands.get('help').execute(message, args);
    } else if(command === 'rainbow'){
        client.commands.get('rainbow').execute(message, args);
    } else if(command === 'test'){
        client.commands.get('test').execute(message, args);
    }
});

client.login(process.env.TOKEN);