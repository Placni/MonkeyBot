const guildSettings = require('../schema/guildSchema');
const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "prefix",
    description: "set the command prefix for your server",
    usage: `\`${process.env.PREFIX}prefix <prefix>\``,
    category: "Utility",
    alias: ["prefix", "p"],
    disabled: false,
    cache: {},
    async execute(message, args){ 
        if (!(message.author.id == process.env.OWNERID || message.member.hasPermission('ADMINISTRATOR'))){
            message.reply(" you don't have the permission to call this!");
            return common.logerror(message, this.name, "invalid permision");
        }
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
                _id: message.guild.id,
                prefix: newPrefix,
            },
            {
                upsert: true,
            }
        );
        message.reply(` changed prefix to \`${newPrefix}\``);
        this.cache[message.guild.id] = newPrefix;
    },

    async prefixCheck(message){
        let prefix;
        if (!this.cache[message.guild.id]){
            let settings = await guildSettings.findOne({ _id: message.guild.id });
            if (!settings){
                settings = await guildSettings.create({
                    _id: message.guild.id,
                    prefix: '-',
                });
                await settings.save();
            }
            this.cache[message.guild.id] = settings.prefix;
            return prefix = this.cache[message.guild.id];
        } else {
            return prefix = this.cache[message.guild.id];
        }
    }
}