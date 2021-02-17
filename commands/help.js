const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "test",
    description: "grabs pfp of user",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Utils",
    alias: ["help", "commands", "h"],
    disabled: false,
    execute(message, args){
         let client = message.client;
         let comlist = { Utils: [], General: [], Admin: []};

         for (c of client.commands) {
             let cmd = c[1];
             if (!cmd.disabled){
                 comlist[cmd.category].push(`**${cmd.name}**: ${cmd.description}`);
             } else {
                 comlist[cmd.category].push(`**❌ ${cmd.name}**: ${cmd.description}`);
             }
         }
    }
}