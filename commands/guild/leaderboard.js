const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, InteractionType } = require('discord.js');
const { sanitizeString, hhmmss } = require('@util/common');
const { wordCheck } = require('@commands/guild/trackword');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "leaderboard",
    description: "Displays your guild leaderboards!",
    usage: `\`${process.env.PREFIX}leaderboard <word>\``,
    alias: ["lb"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'word',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ name: 'word', type: ApplicationCommandOptionType.String, description: 'Word to display on the leaderboard', required: true }],
            description: 'Displays a leaderboard for a tracked word'
        },
        {
            name: 'vctime',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Displays a leaderboard for time spent in a voice channel'
        },
        {
            name: 'messages',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Displays a leaderboard for messages sent in text channels'
        }
    ],
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        const guildId = interaction.guildId;
        let words, word;

        if(isSlash) {
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply();
            switch(com) {
                case 'word':
                    word = sanitizeString(interaction.options.getString('word'), true).toLowerCase();
                    words = await wordCheck(guildId);
                    if(!words.includes(word)) {
                        return interaction.editReply(
                        { content: `Your server isn't tracking **${word}**!\n Use /trackword list to see a current list`,
                        ephemeral: true });
                    }
                    return interaction.editReply(await wordLb(word));
                case 'vctime':
                    return interaction.editReply(await miscLb('vcTime'));
                case 'messages':
                    return interaction.editReply(await miscLb('msgCount'));
            }
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a word to display! ' });
            word = sanitizeString(args[0]).toLowerCase();
            words = await wordCheck(guildId);
            if(!words.includes(word)) {
            return interaction.reply(
                { content: `Your server isn't tracking **${word}**!\n Use /trackword list to see a current list`,
                ephemeral: true });
            }
            return interaction.reply(await wordLb(word));
        }

        async function wordLb(word) {
            let data = await dbhelper.getGuildSettings(guildId);
            data = data.userinfo;
            const pairs = new Map();
            for(const [userId, userInfo] of Object.entries(data)) {
                if(!userInfo?.trackers[word]) continue;
                pairs.set(userId, userInfo.trackers[word]);
            }
            if(!pairs.size) return { content: 'No one in this guild has used that word!' };
            return { embeds: [processMap(pairs, word)] };
        }

        async function miscLb(option) {
            let data = await dbhelper.getGuildSettings(guildId);
            data = data.userinfo;
            const pairs = new Map();
            for(const [userId, userInfo] of Object.entries(data)) {
                if(!userInfo[option]) continue;
                pairs.set(userId, userInfo[option]);
            }
            if(!pairs.size) return { content: 'No data to display!' };
            return (option !== 'vcTime')
                ? { embeds: [processMap(pairs, option)] }
                : { embeds: [processMap(pairs, option, true)] };
        }

        function processMap(map, title, vcTime) {
            map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
            let idList = Array.from(map.keys()).map(e => `<@${e}>`);
            idList = (idList.length > 10) ? idList.slice(9).join('\n') : idList.join('\n');
            let valList = (vcTime)
                ? Array.from(map.values()).map(e => hhmmss(e))
                : Array.from(map.values());
            valList = (valList.length > 10) ? valList.slice(9).join('\n') : valList.join('\n');
            return leaderEmbed(idList, valList, title);
        }

        function leaderEmbed(users, values, type) {
            const leaderEmbed = new EmbedBuilder()
                .setColor('#803d8f')
                .setAuthor({ name: `Leaderboard for: ${type}`, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 }) })
                .addFields(
                    { name: 'Top 10', value: users, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                    { name: 'Count', value: values, inline: true }
                )
                .setFooter({ text: `Try /leaderboard to find out what else you can do!` });
            return leaderEmbed;
        }
    }
};