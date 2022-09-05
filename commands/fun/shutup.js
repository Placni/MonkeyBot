const { findMember } = require('@util/common');
const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, InteractionType } = require('discord.js');

module.exports = {
    name: "shutup",
    description: "Server mutes the target user",
    usage: `\`${process.env.PREFIX}shutup <target> <time>\``,
    alias: ["silence"],
    disabled: false,
    slash: true,
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'target',
            type: ApplicationCommandOptionType.User,
            description: 'User to be silenced',
            require: true
        },
        {
            name: 'time',
            type: ApplicationCommandOptionType.Integer,
            description: 'How long the user will be silenced in seconds',
            require: true,
            min_value: 1,
            max_value: 10,
        }
    ],
    permission: PermissionFlagsBits.MuteMembers,
    async execute(interaction, args) {
        const isSlash = interaction.type === InteractionType.ApplicationCommand;

        if(isSlash) {
            const target = await findMember(interaction.options.getUser('target'), interaction);
            if(!target || !target.voice.channel) return interaction.reply({ content: `Couldn't find that user!`, ephemeral: true });
            let time = await interaction.options.getInteger('time');
            if(!time) time = 5;
            const success = plsShutUp(target, (time * 1000));
            if(!success) return interaction.reply({ content: `An error occured while muting your target!`, ephemeral: true });
            return interaction.reply({ content: `Silenced <@${target.id}> for ${time}s`, ephemeral: true });
        } else {
            if(!args.length) return interaction.reply({ content: 'Specify a user!' });
            const target = await findMember(args[0], interaction);
            if(!target) return interaction.reply({ content: `Couldn't find specified user!` });
            let time = parseInt(args[1]);
            (!time || time > 10 || time < 1) ? time = 5 : time = Math.ceil(time);
            const success = plsShutUp(target, (time * 1000));
            if(!success) return interaction.reply({ content: `An error occured while muting your target!` });
            return interaction.reply({ content: `Silenced <@${target.id}> for ${time}s` });
        }

        function toggleMute(target) {
            if (!target.voice.channel) return false;
            (!target.voice.serverMute) ? target.voice.setMute(true, "") : target.voice.setMute(false, "");
            return true;
        }
        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
        }
        async function plsShutUp(target, ms) {
            const done = toggleMute(target);
            if (!done) return false;
            await sleep(ms);
            toggleMute(target);
            return true;
        }
    }
};