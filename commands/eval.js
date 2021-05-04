const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "eval",
    description: "remotely run code from command",
    usage: `\`${process.env.PREFIX}eval "<code>"\``,
    category: "Admin",
    alias: ["eval"],
    disabled: false,
    execute(message, args){
        if (message.author.id !== process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            return;
        }

        try {
            const code = args.join(" ");
            let evaled = eval(code);
       
            if (typeof evaled !== "string")
              evaled = require("util").inspect(evaled);
       
            message.channel.send(clean(evaled), {code:"xl"});
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
        }

        function clean(text) {
            if (typeof(text) === "string")
              return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
    }   
}