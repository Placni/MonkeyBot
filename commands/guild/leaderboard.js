const { MessageEmbed } = require('discord.js');
const { wordCheck } = require('@commands/guild/trackword');
const { sanitizeString, hhmmss } = require('@util/common');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "leaderboard",
    description: "Displays your guild leaderboards!",
    usage: `\`${process.env.PREFIX}leaderboard <word>\``,
    alias: ["lb"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'word',
            type: 'SUB_COMMAND',
            options: [{ name: 'word', type: 'STRING', description: 'Word to display on the leaderboard', required: true }],
            description: 'Displays a leaderboard for a tracked word'
        },
        {
            name: 'vctime',
            type: 'SUB_COMMAND',
            description: 'Displays a leaderboard for time spent in a voice channel'
        },
        {
            name: 'messages',
            type: 'SUB_COMMAND',
            description: 'Displays a leaderboard for messages sent in text channels'
        }
    ],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        const guildId = interaction.guildId;
        
        if(isSlash){
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply();
            switch(com){
                case 'word':
                    let word = sanitizeString(interaction.options.getString('word'), true).toLowerCase();
                    let words = await wordCheck(guildId);
                    if(!words.includes(word)) return interaction.editReply(
                        { content: `Your server isn't tracking **${word}**!\n Use /trackword list to see a current list`, 
                        ephemeral: true });
                    return interaction.editReply(await wordLb(word));
                break;
                case 'vctime':
                    return interaction.editReply(await miscLb('vcTime'));
                break;
                case 'messages':
                    return interaction.editReply(await miscLb('msgCount'));
                break;
            }            
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a word to display! '});
            let word = sanitizeString(args[0]).toLowerCase();
            let words = await wordCheck(guildId);
            if(!words.includes(word)) return interaction.reply(
                { content: `Your server isn't tracking **${word}**!\n Use /trackword list to see a current list`, 
                ephemeral: true });
            return interaction.reply(await wordLb(word));
        }

        async function wordLb(word){
            let data = await dbhelper.getGuildSettings(guildId);
            data = data.userinfo;
            var pairs = new Map();
            for(const [userId, userInfo] of Object.entries(data)){
                if(!userInfo?.trackers[word]) continue;
                pairs.set(userId, userInfo.trackers[word]);
            }
            if(!pairs.size) return { content: 'No one in this guild has used that word!' };
            return { embeds: [processMap(pairs, word)] };
        }
        
        async function miscLb(option){
            let data = await dbhelper.getGuildSettings(guildId);
            data = data.userinfo;
            var pairs = new Map();
            for(const [userId, userInfo] of Object.entries(data)){
                if(!userInfo[option]) continue;
                pairs.set(userId, userInfo[option]);
            }
            if(!pairs.size) return { content: 'No data to display!' };
            if(option !== 'vcTime'){
                return { embeds: [processMap(pairs, option)] }
            } else return { embeds: [processMap(pairs, option, true)] }
        }

        function processMap(map, title, vcTime){
            map = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
            let idList = Array.from(map.keys()).map(e => `<@${e}>`);
            idList = (idList.length > 10) ? idList.slice(9).join('\n') : idList.join('\n');
            vcTime
                ? valList = Array.from(map.values()).map(e => hhmmss(e))
                : valList = Array.from(map.values());
            valList = (valList.length > 10) ? valList.slice(9).join('\n') : valList.join('\n');
            return leaderEmbed(idList, valList, title);
        }

        function leaderEmbed(users, values, type){
            const leaderEmbed = new MessageEmbed()
                .setColor('#803d8f')
                .setAuthor({ name: `Leaderboard for: ${type}`, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 }) })
                .addFields(
                    {name: 'Top 10', value: users, inline: true},
                    {name: '\u200B', value: '\u200B', inline: true},
                    {name: 'Count', value: values, inline: true}
                )
                .setFooter({ text: `Try /leaderboard to find out what else you can do!` })   
            return leaderEmbed;
        }
        
    }
}