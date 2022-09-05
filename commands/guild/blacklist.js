const { ApplicationCommandType, ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits, InteractionType } = require('discord.js');
const { findMember } = require('@util/common');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "blacklist",
    description: "Blacklist a user from using the bot in your server",
    usage: `\`${process.env.PREFIX}blacklist <user>\``,
    alias: ["bl"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'print',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Prints the current blacklist'
        },
        {
            name: 'toggle',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ name: 'user', type: ApplicationCommandOptionType.User, description: 'User to add / remove from the blacklist', required: true }],
            description: 'Add or remove a user from the blacklist'
        }
    ],
    permission: PermissionFlagsBits.ManageGuild,
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        const guildId = interaction.guildId;
        let blackList, target;

        if(isSlash) {
            const com = interaction.options.getSubcommand(true);
            await interaction.deferReply({ ephemeral: true });
            switch(com) {
                case 'print':
                    blackList = await getBl();
                    if(!blackList.length) return interaction.editReply({ content: 'This guild has no users blacklisted!', ephemeral: true });
                    return interaction.editReply({ embeds: [blEmbed(blackList)], ephemeral: true });
                case 'toggle':
                    target = interaction.options.getUser('user');
                    return interaction.editReply({ content: await toggleMember(target), ephemeral: true });
            }
        } else {
            if(!args.length) {
                blackList = await getBl();
                if(!blackList.length) return interaction.reply({ content: 'This guild has no users blacklisted!' });
                return interaction.reply({ embeds: [blEmbed(blackList)] });
            }
            target = await findMember(args[0], interaction);
            if(!target) return interaction.reply({ content: 'Couldn\'t find desired user!' });
            return interaction.reply({ content: await toggleMember(target) });
        }

        function blEmbed(list) {
            let users = [];
            list.forEach(e => {
                users.push(`<@${e}>`);
            });
            users = users.join(`\n`);
            const blEmbed = new EmbedBuilder()
                .setColor('#803d8f')
                .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ format: "png", dynamic: true, size: 2048 }) })
                .addFields({ name: '**Current Blacklist:**', value: users });
            return blEmbed;
        }
        async function toggleMember(target) {
            let blackList = await getBl();
            if(blackList.includes(target)) {
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
        async function getBl() {
            const settings = await dbhelper.getGuildSettings(guildId);
            return settings.blacklist;
        }
    }
};