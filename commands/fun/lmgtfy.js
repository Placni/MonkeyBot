const { MessageEmbed } = require('discord.js');
const { ApplicationCommandType, ApplicationCommandOptionType, InteractionType } = require('discord.js');

module.exports = {
    name: "lmgtfy",
    description: "Let me google that for you",
    usage: `\`${process.env.PREFIX}lmgtfy <text> OR reply to a message\``,
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'question',
            type: ApplicationCommandOptionType.String,
            description: 'Question to google',
            required: true,
        }
    ],
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;

        if(isSlash) {
            const question = await interaction.options.getString('question');
            return interaction.reply({ embeds: [buildEmbed(question)] });
        } else {
            const origMessage = await interaction.channel.messages.fetch(interaction.reference?.messageId);
            if(!origMessage?.content) {
                if(!args.length) interaction.reply({ content: 'Specify something to google!' });
                return interaction.reply({ embeds: [buildEmbed(args.join(' '))] });
            } else {
                const question = origMessage.content;
                return origMessage.reply({ embeds: [buildEmbed(question)] });
            }
        }
        function buildEmbed(string) {
            const finalEmbed = new MessageEmbed()
                .setColor('#803d8f')
                .setTitle(string)
                .setURL(`https://letmegooglethat.com/?q=${string.replace(/ /g, "+")}`);
            return finalEmbed;
        }
    }
};