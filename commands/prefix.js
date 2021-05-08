const guildSettings = require('../schema/guildSchema');
const dbhelper = require('../util/dbhelper');
const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "prefix",
    description: "set the command prefix for your server",
    usage: `\`${process.env.PREFIX}prefix <prefix>\``,
    category: "GuildSettings",
    alias: ["prefix", "p"],
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

    async prefixCheck(message){
        let prefix;
        if (!dbhelper.globalCache[message.guild.id]){
            await dbhelper.getGuildSettings(message);
            return prefix = dbhelper.globalCache[message.guild.id].prefix;
        } else {
            return prefix = dbhelper.globalCache[message.guild.id].prefix;
        }
    }
}