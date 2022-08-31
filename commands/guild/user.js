const { getGuildUserProfile } = require('@util/dbhelper');
const { findMember, hhmmss } = require('@util/common');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "user",
    description: "Displays user information",
    usage: `\`${process.env.PREFIX}user <target>\``,
    disabled: false,
    slash: true,
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'get the info of this user',
            required: false
        }
    ],
    async execute(interaction, args){ 
        const isSlash = interaction.isCommand?.();
        let guildMember;

        if (isSlash){
            guildMember = findMember(interaction.options.getUser('user'), interaction);
            if(!guildMember) guildMember = interaction.member
            let finalEmbed = await buildEmbed(guildMember);
            return interaction.reply({embeds: [finalEmbed]})
        } else {
            if(args[0]){
                guildMember = findMember(args[0], interaction);
                if(!guildMember) return interaction.reply(`Couldn't find desired user!`); 
            } else guildMember = interaction.member;
            let finalEmbed = await buildEmbed(guildMember);
            return interaction.reply({embeds: [finalEmbed]});
        }

        async function buildEmbed(member){
            let userdata = await getGuildUserProfile(interaction.guildId, member.id)
            let nicknames = !userdata.nicknames ? ["No Nicknames Logged"] : userdata.nicknames;
            let vcTime = !userdata.vcTime ? 'None' : userdata.vcTime;
            if (vcTime !== 'None') vcTime = hhmmss(vcTime);
            let msgCount = !userdata.msgCount ? 'None' : userdata.msgCount;

            const userEmbed = new MessageEmbed()
                .setColor(member.displayHexColor)
                .addFields(
                    {name: 'User Info', value: `Joined Server: \`${moment(member.joinedAt).format("MM/d/YYYY, h:mm:ss a")}\`\nCreated on: \`${moment(member.user.createdAt).format("MM/d/YYYY, h:mm:ss a")}\`\nUser ID: \`${member.id}\``},
                    {name: 'Past Nicknames', value: `${nicknames.join(', ')}`},
                    {name: 'Interaction', value: `Time in VC: \`${vcTime}\`\nMessages Sent: \`${msgCount}\``}
                )
                .setDescription(`<@${member.id}> (${member.user.tag})`)
                .setThumbnail(member.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
            return userEmbed;
        }
    }
}