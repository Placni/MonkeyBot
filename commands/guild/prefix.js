const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const Discord = require('discord.js');

module.exports = {
    name: "prefix",
    description: "set the command prefix for your server",
    usage: `\`${process.env.PREFIX}prefix <prefix>\``,
    alias: [],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args){ 
        if(!args.length){
            await this.prefixCheck(message).then(prefix => {
                return message.reply(` your current prefix is \`${prefix}\``);
            })
            return;
        }
        let newPrefix = args.join("");
        if (newPrefix == "reset") newPrefix = process.env.PREFIX;
        await guildSettings.findOneAndUpdate(
            {
                _id: message.guild.id
            },
            {
                prefix: newPrefix,
            },
        );
        message.reply(` changed prefix to \`${newPrefix}\``);
        dbhelper.globalCache[message.guild.id].prefix = newPrefix;
    },

    async prefixCheck(guildID){
        let prefix;
        if (!dbhelper.globalCache[guildID]){
            await dbhelper.getGuildSettings(guildID);
            return prefix = dbhelper.globalCache[guildID].prefix;
        } else {
            return prefix = dbhelper.globalCache[guildID].prefix;
        }
    }
}