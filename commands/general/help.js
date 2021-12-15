const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "displays a list of currently usable commands",
    usage: `\`${process.env.PREFIX}help\``,
    alias: ["commands", "h"],
    disabled: true,
    async execute(message, args){
        let client = message.client;
        let comlist = {Utility: [], General: [], Admin: [], GuildSettings: []};

        for (c of client.commands) {
            let com = c[1];
            if (com.disabled == undefined || !com.disabled) {
                comlist[com.category].push([`**${com.name}:** ${com.description}`]);
            }
        }

        const InitialEmbed = new Discord.MessageEmbed()
         .setColor('#803d8f')
         .setTitle('MonkeyBot Commands')
         .addField('Pages:​', `1️⃣ Utility \n 2️⃣ General \n 3️⃣ Admin \n 4️⃣ Guild Settings`)
         .addField('​', '​')
         .setFooter(`Called by ${message.author.tag}`)

        //there has to be a better way to do this
        const msg = await message.channel.send(InitialEmbed)
        msg.react("⭐").then(() => msg.react("1️⃣")).then(() => msg.react("2️⃣")).then(() => msg.react("3️⃣")).then(() => msg.react("4️⃣"));

        const filter = (reaction, user) => {
            return ["⭐","1️⃣", "2️⃣", "3️⃣", "4️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
        }

        const collector = msg.createReactionCollector(filter, { time: 20000});

        collector.on('collect', (reaction, user) => {
            switch(reaction.emoji.name){
                case "⭐":
                    msg.edit(InitialEmbed);
                    ClearReactions(msg, message.author.id);
                break;
                case "1️⃣":
                    msg.edit(pageEmbed('Utility'));
                    ClearReactions(msg, message.author.id);
                break;
                case "2️⃣":
                    msg.edit(pageEmbed('General'));
                    ClearReactions(msg, message.author.id);
                break;
                case "3️⃣":
                    msg.edit(pageEmbed('Admin'));
                    ClearReactions(msg, message.author.id);
                break;
                case "4️⃣":
                    msg.edit(pageEmbed('GuildSettings'));
                    ClearReactions(msg, message.author.id);
                break;
            }
        });

        function pageEmbed(page){
            const PageEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setTitle('MonkeyBot Commands')
            .addField(`${page} Commands:​`, comlist[page])
            .addField('\u200b', '​\u200b')
            .setFooter(`Requested by ${message.author.tag}`)
            return PageEmbed;
        }

        async function ClearReactions(message, id){
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(id));
            try {
                 for (const reaction of userReactions.values()) {
                    await reaction.users.remove(id);
                } 
            } catch (error) {
                common.logerror(message, this.name, "error");
            }
        }
        common.logsuccess(message, this.name, "");
    }
}