const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "lmgtfy",
    description: "Let me google that for you",
    usage: `\`${process.env.PREFIX}lmgtfy <text>\``,
    disabled: false,
    slash: true,
    options: [
        {
            name: 'question',
            type: 'STRING',
            description: 'question to google',
            required: false,
        }
    ],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        if(isSlash){
            let question = await interaction.options.getString('question');
            if(!question) {
                if(!interaction.reference?.messageId) return interaction.reply({ content: 'Input or reply to a question with this command!', ephemeral: true });
                let origMessage = await interaction.channel.messages.fetch(interaction.reference?.messageId);
                if(!origMessage?.content) return interaction.reply({ content: 'Message contains no text or was deleted', ephemeral: true });
                question = origMessage.content.replace(/ /g,"+");
                return origMessage.reply({ embeds: [buildEmbed(question)] });
            } else {
                question = question.replace(/ /g, "+");
                return interaction.reply({ embeds: [buildEmbed(question)] });
            }
        } else {
            if(!args.length) interaction.reply({ content: 'Specify something to google!'});
            question = args.split('+');
            return interaction.reply({ embeds: [buildEmbed(question)] });
        }
        function buildEmbed(string) {
            const finalEmbed = new MessageEmbed()
                .setColor('#803d8f')
                .setTitle('For the idiot')
                .setURL(`https://letmegooglethat.com/?q=${string}`)
            return finalEmbed;
        }
    }
}