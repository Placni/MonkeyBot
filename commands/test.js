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

        async function init() {
            console.log(1);
            await sleep(1000);
            console.log(2);
          }
          
          function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }   

          init();
          
    }
}