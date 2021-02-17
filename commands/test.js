const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "test",
    description: "grabs pfp of user",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Test",
    alias: ["test", "test1", "test2"],
    disabled: false,
    execute(message, args){ 

        message.reply("Grabbed command with alias");

    }
}