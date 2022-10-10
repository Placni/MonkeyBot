const { ApplicationCommandType, ApplicationCommandOptionType, InteractionType, EmbedBuilder } = require('discord.js');
const moment = require('moment');
const wait = require('node:timers/promises').setTimeout;
const destinyKeys = require('@schema/destinySchema').default;
const dbhelper = require('@util/dbhelper');

module.exports = {
    name: "auth",
    description: "Authorize Monkeybot with your Bungie account",
    usage: `\`${process.env.PREFIX}auth\``,
    disabled: false,
    slash: true,
    options: [
        {
            name: 'reset',
            type: ApplicationCommandOptionType.Boolean,
            description: 'Reset your Bungie authorization?',
            required: false
        },
    ],
    type: ApplicationCommandType.ChatInput,
    async execute(interaction) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;
        const userId = (isSlash) ? interaction.user.id : interaction.author.id;
        const data = await dbhelper.getDestinyTokens(userId);

        const alreadyEmbed = new EmbedBuilder().setDescription('Your Bungie account is already authorized with me!\nUse `/auth reset` to clear your authorization').setColor('803d8f');
        const dmEmbed = new EmbedBuilder().setDescription('A DM has been sent to you!').setColor('#803d8f');
        const sucessEmbed = new EmbedBuilder().setDescription('Successfully authenticated with Bungie!').setColor('Green');
        const failEmbed = new EmbedBuilder().setDescription('Authentification failed!\nYell at Myssto or try again').setColor('Red');

        if(isSlash) {
            await interaction.deferReply({ ephemeral: true });
            const isReset = interaction.options.getBolean('reset');
            if(isReset) {
                if(!data) return interaction.reply({ content: 'You have not authorized me with Bungie!', ephemeral: true });
                await destinyKeys.deleteOne({ _id: userId });
                delete dbhelper.globalCache.destiny[userId];
                return interaction.editReply({ content: 'Successfully cleared Bungie authorization!', ephemeral: true });
            }
            if(!data) {
                await interaction.editReply({ embeds: [dmEmbed], ephemeral: true });
                return await authUser(interaction.user, userId);
            }
            return interaction.editReply({ embeds: [alreadyEmbed], ephemeral: true });
        } else {
         if(!data) {
                await interaction.reply({ embeds: [dmEmbed] });
                return await authUser(interaction.author, userId);
            }
            return interaction.reply({ embeds: [alreadyEmbed] });
        }

        async function authUser(user, userId) {
            const dm = await user.send({ embeds: [authEmbed(userId)] });
            const eventEmitter = destinyKeys.watch();
            eventEmitter.on('change', doc => {
                if (doc?.operationType == 'insert' && doc?.documentKey?._id == userId) {
                    eventEmitter.close();
                    return dm.edit({ embeds: [sucessEmbed] });
                }
            });
            await wait(180000);
            if (eventEmitter.isClosed) return;
            eventEmitter.close();
            return dm.edit({ embeds: [failEmbed] });
        }

        function authEmbed(userId) {
            const expiry = moment(Date.now()).add(3, "m");
            const authEmbed = new EmbedBuilder()
                .setDescription(`[Click here to authorize with Bungie](https://www.bungie.net/en/OAuth/Authorize?client_id=40995&response_type=code&state=${userId})
                    \nLink will expire: <t:${Math.trunc(expiry / 1000)}:R>`)
                .setColor('#803d8f');
            return authEmbed;
        }
    }
};