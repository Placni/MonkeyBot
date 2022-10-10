const { InteractionType } = require('discord.js');
const { HttpClientConfig, getProfile, DestinyComponentType } = import("bungie-api-ts/destiny2");

module.exports = {
    name: 'vendor',
    description: 'Pulls d2 vendor info',
    usage: `\`${process.env.PREFIX}vendor\``,
    disabled: false,
    slash: true,
    async execute(interaction, args, client) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;

        if(isSlash) {

        }

        async function $http(config, options) {
            return fetch(config.url, options);
        }

        const profileInfo = await getProfile($http, {
            components: [DestinyComponentType.Profiles, DestinyComponentType.Characters],
            destinyMembershipId: 11,

        });

    }
};