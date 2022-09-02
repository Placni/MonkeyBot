const { findMember } = require('@util/common');
const { MessageEmbed } = require('discord.js');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "blacklist",
    description: "blacklist a user from using the bot in your server",
    usage: `\`${process.env.PREFIX}blacklist <user>\``,
    alias: ["bl"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'print',
            type: 'SUB_COMMAND',
            description: 'Prints the current blacklist'
        },
        {
            name: 'toggle',
            type: 'SUB_COMMAND',
            options: [{ name: 'user', type: 'USER', description: 'User to add / remove from the blacklist', required: true }],
            description: 'Add or remove a user from the blacklist'
        }
    ],
    permission: ['ADMINISTRATOR'],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        const guildId = interaction.guildId;
        var blackList, target;

        if(isSlash){
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply({ ephemeral: true });
            switch(com){
                case 'print':
                    blackList = await getBl();
                    if(!blackList.length) return interaction.editReply({ content: 'This guild has no users blacklisted!', ephemeral: true });
                    return interaction.editReply({ embeds: [blEmbed(blackList)], ephemeral: true });
                case 'toggle':
                    target = interaction.options.getUser('user');
                    return interaction.editReply({ content: await toggleMember(target), ephemeral: true });
            }
        } else {
            if(!args.length){
                blackList = await getBl();
                if(!blackList.length) return interaction.reply({ content: 'This guild has no users blacklisted!' });
                return interaction.reply({ embeds: [blEmbed(blackList)] });
            }
            target = await findMember(args[0], interaction);
            if(!target) return interaction.reply({ content: 'Couldn\'t find desired user!' });
            return interaction.reply({ content: await toggleMember(target) });
        }

        function blEmbed(list){
            let users = [];
            list.forEach(e => {
                users.push(`<@${e}>`);
            });
            users = users.join(`\n`);
            const blEmbed = new MessageEmbed()
                .setColor('#803d8f')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 })})
                .addFields({ name: '**Current Blacklist:**', value: users })
            return blEmbed;
        }
        async function toggleMember(target){
            var blackList = await getBl();
            if(blackList.includes(target)){
                blackList = blackList.filter(e => e !== target);
                dbhelper.globalCache[guildId].blacklist = blackList;
                await guildSettings.findOneAndUpdate({ _id: guildId }, { blacklist: blackList });
                return `No longer blacklisting <@${target.user.id}> in this guild`;
            } else {
                blackList.push(target);
                dbhelper.globalCache[guildId].blacklist = blackList;
                await guildSettings.findOneAndUpdate({ _id: guildId }, { blacklist: blackList });
                return `Now blacklisting <@${target.user.id}> in this guild`;
            }
        }
        async function getBl(){
            let settings;
            (!dbhelper.globalCache[guildId]) ? settings = await dbhelper.getGuildSettings() : settings = dbhelper.globalCache[guildId];
            return settings.blacklist;
        }
    }
}