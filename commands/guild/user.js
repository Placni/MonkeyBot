const dbhelper = require('@util/dbhelper');
const { findMember } = require('@util/common');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "user",
    description: "display user information",
    usage: `\`${process.env.PREFIX}user <target>\``,
    alias: [],
    disabled: false,
    permission: ['ADMINISTRATOR'],
    async execute(message, args, client){ 
        let guildMember;
        if(args[0]){
            guildMember = await findMember(args[0], message);
            if(!guildMember) return message.channel.send(`Couldn't find desired user!`); 
        } else guildMember = message.member;
        let userdata = await dbhelper.getGuildUserProfile(message.guild.id, guildMember.id);

        let nicknames = !userdata.nicknames ? ["No Nicknames Logged"] : userdata.nicknames;
        let vcTime = !userdata.vcTime ? 'None' : userdata.vcTime;
        if (vcTime !== 'None'){
            let hrs = Math.floor((vcTime / 60) / 60);
            let mins = Math.floor((vcTime / 60) - (hrs * 60));
            let secs = Math.floor(vcTime - ((hrs * 60 * 60) + (mins * 60)));
            vcTime = `${hrs}hrs ${mins}mins ${secs}s`;
        }
        let msgCount = !userdata.msgCount ? 'None' : userdata.msgCount;
        
        const embed = new Discord.MessageEmbed()
            .setColor(guildMember.displayHexColor)
            .addFields(
                {name: 'User Info', value: `Joined Server: \`${moment(guildMember.joinedAt).format("MM/d/YYYY, h:mm:ss a")}\`\nCreated on: \`${moment(guildMember.user.createdAt).format("MM/d/YYYY, h:mm:ss a")}\`\nUser ID: \`${guildMember.id}\``},
                {name: 'Past Nicknames', value: `${nicknames.join(', ')}`},
                {name: 'Interaction', value: `Time in VC: \`${vcTime}\`\nMessages Sent: \`${msgCount}\``}
            )
            .setDescription(`<@${guildMember.id}> (${guildMember.user.tag})`)
            .setThumbnail(guildMember.user.displayAvatarURL({ format: "png", dynamic: true, size: 2048 }))
        
        message.channel.send({embeds: [embed]});
    }
}