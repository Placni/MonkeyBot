const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');
const { MessageEmbed } = require('discord.js');

var self = module.exports = {
    name: "trackword",
    description: "add or delete a word to track in your server",
    usage: `\`${process.env.PREFIX}trackword <add/delete/clear> <word>\``,
    alias: [],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'add',
            type: 'SUB_COMMAND',
            description: 'Adds a word to be tracked',
            options: [{ name: 'word', type: 'STRING', description: 'What word to be tracked', required: true }]
        },
        {
            name: 'delete',
            type: 'SUB_COMMAND',
            description: 'Deletes a currently tracked word',
            options: [{ name: 'word', type: 'STRING', description: 'What word to be deleted', required: true }]
        },
        {
            name: 'clear',
            type: 'SUB_COMMAND',
            description: 'Clears your currently tracked words',
        },
        {
            name: 'list',
            type: 'SUB_COMMAND',
            description: 'Displays a list of currently tracked words'
        }
    ],
    permission: ['MANAGE_MESSAGES'],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        const guildId = interaction.guild.id;
        var word;
        let words;

        if(isSlash) {
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply({ ephemeral: true });
            switch(com) {
                case 'add':
                    word = interaction.options.getString('word');
                    return interaction.editReply({ content: await addWord(word), ephemeral: true});
                break;
                case 'delete':
                    word = interaction.options.getString('word');
                    return interaction.editReply({ content: await delWord(word), ephemeral: true});
                break;
                case 'clear':
                    await updateWords([]);
                    return interaction.editReply({ content: `Your server is no longer tracking any words!`, ephemeral: true});
                break;
                case 'list':
                    words = await self.wordCheck(guildId);
                    if(!words.length) {
                        return interaction.editReply({ content: 'Your server isn\'t tracking any words!', ephemeral: true });
                    } else return interaction.editReply({ embeds: [wordsEmbed(words)], ephemeral: true });
                break;
            }
        } else {
            return;
        }

        async function delWord(word){
            let words = await this.wordCheck(guildId);
            if(!words.includes(word)) return `This server isn't tracking **${word}**!`;
            words = words.filter(e => e !== word);
            await updateWords(words);
            return `Your server is no longer tracking **${word}**`;
        }

        async function addWord(word){
            let words = await this.wordCheck(guildId);
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
            let words = list.join(`\n`);
            const wordsEmbed = new MessageEmbed()
            .setColor('#803d8f')
            .setAuthor({ name: "Currently Tracking:", iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 })})
            .addFields({ name: `Total: ${words.length}`, value: 'words' })
            .setFooter({ text: `\`Use /leaderboard {word}\` to check the leaderboards` })
            return wordsEmbed;
        }
    },
    async wordCheck(guildId){
        let words;
        if (!dbhelper.globalCache[guildId]){
            await dbhelper.getGuildSettings(guildId);
            return words = dbhelper.globalCache[guildId].trackedwords;
        } else {
            return words = dbhelper.globalCache[guildId].trackedwords;
        }
    }
}