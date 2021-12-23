const common = require('@util/common');
const Discord = require('discord.js');

module.exports = {
    name: "getpfp",
    description: "grabs the avatar of a user",
    usage: `\`${process.env.PREFIX}getpfp <user>\``,
    alias: ["pfp", "avatar", "av"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'user',
            description: "get the profile picture of this user",
            required: false,
            type: 'USER',
        }
    ],
    async execute(interaction, args) {
        const isSlash = interaction.isCommand?.();
        let format = { format: "png", dynamic: true, size: 2048 };
        let target;
        let caller;

        if (isSlash) {
            caller = interaction.user;
            target = await common.findMember(interaction.options.get("user")?.user, interaction);
            if (!target) target = interaction.member;
        } else {
            caller = interaction.author;
            if (!args.length) {
                target = interaction.member;
            } else {
                target = await common.findMember(args.join(" "), interaction);
                if (!target) return interaction.reply("**Couldn't find desired user!**");
            }
        }
        const pfpEmbed = new Discord.MessageEmbed()
            .setColor('#803d8f')
            .setAuthor(`${target.displayName}'s pfp`)
            .setImage(target.displayAvatarURL(format))
            .setFooter(`Called by ${caller.tag}`)
            .setTimestamp()
        interaction.reply({ embeds: [pfpEmbed] });
    }
}