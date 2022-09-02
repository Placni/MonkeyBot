const common = require('@util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

// const fs = require('fs');

// THIS WAS WRITTEN AS A NOVELTY
// Only enable this command or import fs if you're 100%
// certain you undertand what it could do to your
// system if your account were to be compromised

module.exports = {
    name: "eval",
    description: "Remotely run JS code",
    usage: `\`${process.env.PREFIX}eval <code>\``,
    disabled: true,
    execute(message, args, client){
        if (message.author.id !== process.env.OWNERID) return;

        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
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