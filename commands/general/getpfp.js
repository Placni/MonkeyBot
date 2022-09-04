const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, InteractionType } = require('discord.js');
const { findMember } = require('@util/common');

module.exports = {
    name: "getpfp",
    description: "Displays the avatar of a user",
    usage: `\`${process.env.PREFIX}getpfp <user>\``,
    alias: ["pfp", "avatar", "av"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: "Display the profile picture of this user",
            required: false,
        }
    ],
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        let format = { format: "png", dynamic: true, size: 2048 };
        let target, caller;

        if (isSlash) {
            caller = interaction.user;
            target = await findMember(interaction.options.get("user")?.user, interaction);
            if (!target) target = interaction.member;
        } else {
            caller = interaction.author;
            if (!args.length) {
                target = interaction.member;
            } else {
                target = await findMember(args.join(" "), interaction);
                if (!target) return interaction.reply("**Couldn't find desired user!**");
            }
        }
        const pfpEmbed = new EmbedBuilder()
            .setColor('#803d8f')
            .setAuthor({name: `${target.displayName}'s pfp`})
            .setImage(target.displayAvatarURL(format))
            .setFooter({text: `Called by ${caller.tag}`})
            .setTimestamp()
        interaction.reply({ embeds: [pfpEmbed] });
    }
}