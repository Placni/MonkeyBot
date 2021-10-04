const common = require('@util/common');
const Discord = require('discord.js');
const math = require(`mathjs`);

//THIS COMMAND WILL RATE LIMIT THE BOT IF USED IN A CHANNEL WITH OVER 5 PEOPLE

module.exports = {
    name: "shutup",
    description: "server mutes the targeted user(s)",
    usage: `\`${process.env.PREFIX}shutup <target> <channel> <time>\``,
    category: "General",
    alias: ["silence"],
    disabled: false,
    permission: ['MUTE_MEMBERS'],
    execute(message, args){ 
        let targetChannel;
        let target = args.shift();
        let time;

        if (!target) return message.reply(" specify a person you monkey");
        if (target == 'all'){
            targetChannel = args.shift();
            targetChannel = common.GetVcID(targetChannel, message);
            if(!targetChannel) return message.reply(" couldn't find desired channel!"); 
            target = 'all'
        } else {
            target = common.GetUserID(target, message);
            if (!target) return message.reply(" couldn't find desired user!");               
        }

        time = Number(time);
        if (!time || !math.isNumeric(time) || time > 10){
            time = 5000;
        } else {
            time = math.ceil(time);
            time = (time * 1000);
        }

        function ToggleMute(target){
            if (!target.voice.channel){
                message.reply(" that user isn't in vc you monkey");
                return false;
            }
            if (!target.voice.serverMute){
                target.voice.setMute(true, "");
            } else {
                target.voice.setMute(false, "");
            }
            return true;
        }
        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }
        async function PlsShutUp(target, ms) {
            let done = ToggleMute(target);
            if (!done) return;
            await sleep(ms);
            ToggleMute(target);
        }

        //mutes user(s) based on target type
        if(target == 'all'){
            for(let [snowflake, guildMember] of targetChannel.members){
                PlsShutUp(guildMember, time);
                message.channel.send(`**${guildMember.user.tag}** has been silenced for **${(time / 1000)}s**`);
            }
          } else {
            PlsShutUp(target, time);
            message.channel.send(`**${target.user.tag}** has been silenced for **${(time / 1000)}s**`);
        } 
    }
}