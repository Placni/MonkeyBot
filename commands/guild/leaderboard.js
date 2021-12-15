const Discord = require('discord.js');
const dbhelper = require('@util/dbhelper');

//there has to be a more efficient way to do this right?

module.exports = {
    name: "leaderboard",
    description: "displays your guild leaderboards!",
    usage: `\`${process.env.PREFIX}test\``,
    alias: ["board", "lb"],
    disabled: false,
    async execute(message, args){ 
        if(!dbhelper.globalCache[message.guild.id]) await dbhelper.getGuildSettings(message.guild.id);
        let guildinfo = dbhelper.globalCache[message.guild.id];
        let possibleBoards = guildinfo.trackedwords;

        if(!args.length) return message.reply('Specify a leaderboard to view!');
        if(!possibleBoards.includes(args[0])) return message.reply(`You are not tracking that! \n Use \`${guildinfo.prefix}trackword\` to see what you are tracking`);
        let desiredBoard = args[0];

        //search for users who have desired item tracked
        let vals = [];
        let tracked = {};
        for (const [userid, obj] of Object.entries(guildinfo.userinfo)){
            if(!obj.hasOwnProperty('trackers')) continue;
            if(!obj.trackers.hasOwnProperty(desiredBoard)) continue;
            tracked[`<@${userid}>`] = obj.trackers[desiredBoard];
            vals.push(obj.trackers[desiredBoard]);  
        }

        //sort the values in descending order
        let str = "";
        vals.sort((a, b) => {return b-a});
        if(vals.length >= 9) vals = vals.slice(9, vals.length);
        //match the sorted values back to the users
        vals.forEach(e => {
            for (const [userid, num] of Object.entries(tracked)){
                if(num == e) str += (userid + `\n`);
            }
        });

        const leaderEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`Leaderboard for "${desiredBoard}"`, message.guild.iconURL({ format: "png", dynamic: true, size: 2048 }))
            .addFields(
                {name: 'Top 10', value: str, inline: true},
                {name: '\u200B', value: '\u200B', inline: true},
                {name: 'Count', value: vals.join(`\n`), inline: true}
            )
            .setFooter(`Requested by ${message.author.tag}`)
        message.channel.send({embeds: [leaderEmbed]});
    }
}