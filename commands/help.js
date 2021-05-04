const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "help",
    description: "displays a list of currently usable commands",
    usage: `\`${process.env.PREFIX}help\``,
    category: "Utility",
    alias: ["help", "commands", "h"],
    disabled: false,
    async execute(message, args){
        let client = message.client;
        let comlist = {Utility: [], General: [], Admin: []};

         for (c of client.commands) {
             let com = c[1];
             if (com.disabled == undefined || !com.disabled) {
                 comlist[com.category].push([`**${com.name}:** ${com.description}`]);
             }
         }
         
         const InitialEmbed = new Discord.MessageEmbed()
         .setColor('#803d8f')
         .setTitle('MonkeyBot Commands')
         .addField('Pages:​', `1️⃣ Utility \n 2️⃣ General \n 3️⃣ Admin`)
         .addField('​', '​')
         .setFooter(`Called by ${message.author.tag}`)
         .setTimestamp()

         const UtilityEmbed = new Discord.MessageEmbed()
         .setColor('#803d8f')
         .setTitle('MonkeyBot Commands')
         .addField('Utility Commands:​', comlist.Utility)
         .addField('​', '​')
         .setFooter(`Called by ${message.author.tag}`)
         .setTimestamp()

         const GeneralEmbed = new Discord.MessageEmbed()
         .setColor('#803d8f')
         .setTitle('MonkeyBot Commands')
         .addField('General Commands:​', comlist.General)
         .addField('​', '​')
         .setFooter(`Called by ${message.author.tag}`)
         .setTimestamp()

         const AdminEmbed = new Discord.MessageEmbed()
         .setColor('#803d8f')
         .setTitle('MonkeyBot Commands')
         .addField('Admin Commands:​', comlist.Admin)
         .addField('​', '​')
         .setFooter(`Called by ${message.author.tag}`)
         .setTimestamp()
         
         const msg = await message.channel.send(InitialEmbed)
         msg.react("1️⃣").then(() => msg.react("2️⃣")).then(() => msg.react("3️⃣"));

         const filter = (reaction, user) => {
             return ["1️⃣", "2️⃣", "3️⃣"].includes(reaction.emoji.name) && user.id === message.author.id;
         }

         const collector = msg.createReactionCollector(filter, { time: 20000});

         collector.on('collect', (reaction, user) => {
            switch(reaction.emoji.name){
                case "1️⃣":
                    msg.edit(UtilityEmbed);
                    ClearReactions(msg, message.author.id);
                break;
                case "2️⃣":
                    msg.edit(GeneralEmbed);
                    ClearReactions(msg, message.author.id);
                break;
                case "3️⃣":
                    msg.edit(AdminEmbed);
                    ClearReactions(msg, message.author.id);
                break;
            }
         });

         async function ClearReactions(message, id){
            const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(id));
            try {
                 for (const reaction of userReactions.values()) {
                    await reaction.users.remove(id);
                } 
            } catch (error) {
                console.log("error");
            }
         }
    }
}