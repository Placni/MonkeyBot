const { ApplicationCommandType, ApplicationCommandOptionType, PermissionFlagsBits, InteractionType } = require('discord.js');

module.exports = {
	name: 'purge',
	description: 'Purges messages from the channel',
	usage: `\`${process.env.PREFIX}purge <value>\``,
	alias: ['clear'],
	disabled: false,
	slash: true,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: 'count',
			type: ApplicationCommandOptionType.Integer,
			description: 'Number of messages to be purged',
			required: true,
			min_value: 1,
			max_value: 100
		}
	],
	permission: PermissionFlagsBits.ManageMessages,
	async execute(interaction, args) {
		const isSlash = interaction.type === InteractionType.ApplicationCommand;
		let count;

		if (isSlash) {
			count = await interaction.options.getInteger('count');
			interaction.deferReply({ ephemeral: true });
			return interaction.editReply({ content: await blkDel(count), ephemeral: true });
		} else {
			count = args[0];
			if (!count) return interaction.reply('Please specify an amount of messages!');
			if (isNaN(count) || (count < 1)) return interaction.reply('Please enter a valid number!');
			count = Math.ceil(count) > 100 ? 100 : Math.ceil(count);
			return interaction.reply({ content: await blkDel(count) });
		}

		async function blkDel(int) {
			try {
				await interaction.channel.messages.fetch({ limit: int })
					.then(messages => interaction.channel.bulkDelete(messages));
				return `Successfully purged ${int} messages`;
			} catch (e) {
				return 'An error occured';
			}
		}
	}
};
