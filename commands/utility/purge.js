module.exports = {
    name: "purge",
    description: "Purges messages from the channel",
    usage: `\`${process.env.PREFIX}purge <value>\``,
    alias: ["clear"],
    disabled: false,
    slash: true,
    options: [
        {
            name: 'count',
            type: 'INTEGER',
            description: 'Number of messages to be purged',
            required: true,
            min_value: 1,
            max_value: 100,
        }
    ],
    permission: ['MANAGE_MESSAGES'],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        const count = 0;
        if (isSlash){
            count = await interaction.options.getInteger('count');
            interaction.deferReply({ ephemeral: true });
            return blkDel(count);
        } else {
            count = args[0];
            if(!count) return interaction.reply('Please specify an amount of messages!');
            if(isNaN(count) || (count < 1)) return interaction.reply('Please enter a valid number!');
            count = math.ceil(count) > 100 ? 100 : math.ceil(count);
            interaction.deferReply({ ephemeral: true });
            return blkDel(count);
        }
        
        function blkDel(int){
            try {
                await interaction.channel.messages.fetch({limit: count}).then(messages => {
                interaction.channel.bulkDelete(messages)
                .then(interaction.editReply({ content: `Successfully purged **${count}** messages`, ephemeral: true}));
            })
            } catch(e) {
                interaction.editReply({ content: `An error occured`, ephemeral: true });
            }
        }
    }
}