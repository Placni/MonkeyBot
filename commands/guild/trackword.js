const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits, InteractionType } = require('discord.js');
const { sanitizeString } = require('@util/common');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

var self = module.exports = {
    name: "trackword",
    description: "add or delete a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <add/del/clear> <word>\``,
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'add',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Adds a word to be tracked',
            options: [{ name: 'word', type: ApplicationCommandOptionType.String, description: 'What word to be tracked. Note that the bot will only see the first word you type', required: true }]
        },
        {
            name: 'delete',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Deletes a currently tracked word',
            options: [{ name: 'word', type: ApplicationCommandOptionType.String, description: 'What word to be deleted. Note that the bot will only see the first word you type', required: true }]
        },
        {
            name: 'clear',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Clears your currently tracked words',
        },
        {
            name: 'list',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Displays a list of currently tracked words'
        }
    ],
    permission: PermissionFlagsBits.ManageMessages,
    async execute(interaction, args){ 
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        const guildId = interaction.guild.id;
        var word, words;

        if(isSlash) {
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply({ ephemeral: true });
            switch(com) {
                case 'add':
                    word = sanitizeString(interaction.options.getString('word'), true).toLowerCase();
                    return interaction.editReply({ content: await addWord(word), ephemeral: true});
                break;
                case 'delete':
                    word = sanitizeString(interaction.options.getString('word'), true).toLowerCase();
                    return interaction.editReply({ content: await delWord(word), ephemeral: true});
                break;
                case 'clear':
                    words = await self.wordCheck(guildId);
                    if(!words.length) {
                        return interaction.editReply({ content: 'Your server isn\'t tracking any words!', ephemeral: true });
                    } else {
                        await updateWords([]);
                        return interaction.editReply({ content: `Your server is no longer tracking any words!`, ephemeral: true});
                    }
                break;
                case 'list':
                    words = await self.wordCheck(guildId);
                    if(!words.length) {
                        return interaction.editReply({ content: 'Your server isn\'t tracking any words!', ephemeral: true });
                    } else return interaction.editReply({ embeds: [wordsEmbed(words)], ephemeral: true });
                break;
            }
        } else {
            if(!args.length){
                words = await self.wordCheck(guildId);
                if(!words.length) {
                    return interaction.reply({ content: 'Your server isn\'t tracking any words!' });
                } else return interaction.reply({ embeds: [wordsEmbed(words)] });
            }
            switch(args[0]){
                case 'add':
                    word = sanitizeString(args[1], true);
                    return interaction.reply({ content: await addWord(word) })
                break;
                case 'del':
                case 'delete':
                    word = sanitizeString(args[1], true);
                    return interaction.reply({ content: await delWord(word) })
                break;
                case 'clear':
                    words = await self.wordCheck(guildId);
                    if(!words.length) {
                        return interaction.reply({ content: 'Your server isn\'t tracking any words!' });
                    } else {
                        await updateWords([]);
                        return interaction.reply({ content: `Your server is no longer tracking any words!` });
                    };
                break;
            }
        }

        async function delWord(word){
            let words = await self.wordCheck(guildId);
            if(!words.includes(word)) return `This server isn't tracking **${word}**!`;
            words = words.filter(e => e !== word);
            await updateWords(words);
            return `Your server is no longer tracking **${word}**`;
        }

        async function addWord(word){
            let words = await self.wordCheck(guildId);
            if(words.includes(word)) return `This server is already tracking **${word}**!`;
            words.push(word);
            await updateWords(words);
            return `Your server is now tracking **${word}**`;
        }

        async function updateWords(words){
            dbhelper.globalCache[guildId].trackedwords = words;
            await guildSettings.findOneAndUpdate({ _id: guildId }, { trackedwords: words });
        }

        function wordsEmbed(list){
            const wordsEmbed = new EmbedBuilder()
            .setColor('#803d8f')
            .setAuthor({ name: "Currently Tracking:", iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 })})
            .addFields({ name: `Total: ${list.length}`, value: list.join('\n') })
            .setFooter({ text: `Use \`/leaderboard {word}\` to check the leaderboards` })
            return wordsEmbed;
        }
    },
    async wordCheck(guildId){

        if (!dbhelper.globalCache[guildId]){
            await dbhelper.getGuildSettings(guildId);
            return dbhelper.globalCache[guildId].trackedwords;
        } else {
            return dbhelper.globalCache[guildId].trackedwords;
        }
    }
}