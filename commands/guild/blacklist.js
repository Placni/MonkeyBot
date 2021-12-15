const { findMember } = require('@util/common');
const Discord = require('discord.js');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "blacklist",
    description: "blacklist a user from using the bot in your server",
    usage: `\`${process.env.PREFIX}blacklist <user>\``,
    alias: ["bl"],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args){ 
        if(message.author.id !== message.guild.ownerId) return message.reply('You must be the server owner to use this!');

        let guildID = message.guildId;
        if(!args.length){
            await dbhelper.getGuildSettings(guildID);
            let blacklist = dbhelper.globalCache[guildID].blacklist
            if(!blacklist.length) return message.reply('No one is blacklisted in this server!');
            return message.channel.send({embeds: [blEmbed(blacklist)]});
        }
        let target = await findMember(args[0], message);
        if(!target) return message.reply('Couldnt find desired user!');

        if(!dbhelper.globalCache[guildID]) await dbhelper.getGuildSettings(guildID);
        if(!dbhelper.globalCache[guildID].blacklist){
            dbhelper.globalCache[guildID].blacklist = [target];
            await UpdateDB([target]);
            return message.channel.send(`<@${target.user.id}> has been added to the blacklist`);
        }
        let blacklist = dbhelper.globalCache[guildID].blacklist
        if(blacklist.includes(target.user.id)){
            let newlist = blacklist.filter(e => e !== target.user.id);
            dbhelper.globalCache[guildID].blacklist = newlist;
            await UpdateDB(newlist);
            return message.channel.send(`<@${target.user.id}> has been removed from the blacklist`);
        } else {
            blacklist.push(target.user.id);
            dbhelper.globalCache[guildID].blacklist = blacklist;
            await UpdateDB(blacklist);
            return message.channel.send(`<@${target.user.id}> has been added to the blacklist`);
        }

        function blEmbed(list){
            let users = [];
            list.forEach(e => {
                users.push(`<@${e}>`);
            });
            users = users.join(`\n`);
            const blEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(message.guild.name, message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .addField('​**Current Blacklist:**', users)
            return blEmbed;
        }
        async function UpdateDB(list){
            await guildSettings.findOneAndUpdate({ _id: guildID }, { blacklist: list });
        }
    }
}