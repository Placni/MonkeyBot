const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "test",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Admin",
    alias: ["test", "test1", "test2"],
    disabled: false,
    execute(message, args){ 

      
    }
}