const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');
const dbhelper = require('../util/dbhelper');

module.exports = {
    name: "leaderboard",
    description: "displays your guild leaderboards!",
    usage: `\`${process.env.PREFIX}test\``,
    category: "General",
    alias: ["board"],
    disabled: false,
    execute(message, args){ 
        if(!dbhelper.globalCache[message.guild.id]) dbhelper.getGuildSettings;
        let guildinfo = dbhelper.globalCache[message.guild.id];
        let possibleBoards = guildinfo.trackedwords;

        if(!args.length) return message.reply(' specify a leaderboard to view!');
        if(!possibleBoards.includes(args[0])) return message.reply(` you are not tracking that! \n Use \`${guildinfo.prefix}trackword\` to see what you are tracking`);
        let desiredBoard = args[0];

        let vals = [];
        let tracked = {};
        for (const [userid, obj] of Object.entries(guildinfo.userinfo)){
            if(userid !== 'placeholder' || !obj) {
                tracked[`<@!${userid}>`] = obj.trackers[desiredBoard];
                vals.push(obj.trackers[desiredBoard]);
            }
        }
        let str2 = vals.join(`\n`);

        let str = "";
        vals.sort((a, b) => {return b-a});
        vals.forEach(e => {
            for (const [userid, num] of Object.entries(tracked)){
                if(num == e) str += (userid + `\n`);
            }
        });
        var temparr = str.split('\n')
        str = temparr.filter((value, index, self) => {
            return self.indexOf(value) === index;
        })
        
        const leaderEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`Leaderboard for "${desiredBoard}"`, message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            //.setDescription(`Showing leaderboard for "${desiredBoard}"`)
            .addFields(
                {name: 'Top 10', value: str, inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
                {name: 'Count', value: str2, inline: true}
            )
            .setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ format: "png", dynamic: true, size: 2048 }))
        message.channel.send(leaderEmbed);
    }
}