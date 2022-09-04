const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, InteractionType } = require('discord.js');
const guildSettings = require('@schema/guildSchema');
const dbhelper = require('@util/dbhelper');

var self = module.exports = {
    name: "prefix",
    description: "set the command prefix for your server",
    usage: `\`${process.env.PREFIX}prefix <prefix>\``,
    alias: [],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'print',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Prints your server\'s current prefix'
        },
        {
            name: 'change',
            type: ApplicationCommandOptionType.Subcommand,
            options: [{ name: 'prefix', type: ApplicationCommandOptionType.String, description: 'New server prefix', required: true }],
            description: 'Changes your server prefix'
        }
    ],
    permission: PermissionFlagsBits.ManageGuild,
    async execute(interaction, args){
        const isSlash = interaction.isCommand?.()
        const guildId = interaction.guild.id;

        if(isSlash){
            const com = interaction.options.getSubcommand(true);
            switch(com){
                case 'print':
                    await self.prefixCheck(guildId).then(prefix => {
                        return interaction.reply({ content: `Your server's current prefix is \`${prefix}\``, ephemeral: true });});
                break;
                case 'change':
                    const newPrefix = interaction.options.getString('prefix');
                    await guildSettings.findOneAndUpdate({ _id: guildId }, { prefix: newPrefix });
                    dbhelper.globalCache[guildId].prefix = newPrefix;
                    return interaction.reply({ content: `Changed server prefix to \`${newPrefix}\``, ephemeral: true });
                break;
            }
            return;
        } else {
            if(!args.length){
                await this.prefixCheck(interaction).then(prefix => {
                    return interaction.reply(`Your server's current prefix is: \`${prefix}\``);
                })
                return;
            }
            let newPrefix = args.join('');
            await guildSettings.findOneAndUpdate({ _id: guildId }, { prefix: newPrefix });
            dbhelper.globalCache[guildId].prefix = newPrefix;
            return interaction.reply(`Changed server prefix to \`${newPrefix}\``);
        }
    },

    async prefixCheck(guildID){
        let prefix;
        if (!dbhelper.globalCache[guildID]){
            await dbhelper.getGuildSettings(guildID);
            return prefix = dbhelper.globalCache[guildID].prefix;
        } else {
            return prefix = dbhelper.globalCache[guildID].prefix;
        }
    }
}