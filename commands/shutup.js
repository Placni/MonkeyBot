const common = require('../util/common');
const Discord = require('discord.js');
const math = require(`mathjs`);

//THIS COMMAND WILL RATE LIMIT THE BOT IF USED IN A CHANNEL WITH OVER 5 PEOPLE

module.exports = {
    name: "shutup",
    description: "server mutes the targeted user(s)",
    usage: `\`${process.env.PREFIX}shutup <target> <channel> <time>\``,
    category: "General",
    alias: ["shutup", "silence"],
    disabled: false,
    permission: ['MUTE_MEMBERS'],
    execute(message, args){ 
        //TODO:
        //rewrite this as well jesus

        //init vars
        let targetChannelTemp;
        let targetTemp = args.shift();

        let target;
        let time;
        var targetChannel;

        //check what the user wants to target (all or single user)
        if (!targetTemp){
            message.reply(" specify a person you monkey");
            return;
        } else {
            if(targetTemp == 'all'){
                targetChannelTemp = args.shift();
                targetChannelTemp = common.GetVcID(targetChannelTemp, message);
                if(!targetChannelTemp){
                    message.reply(" couldn't find desired channel!");
                    common.logerror(message, this.name, "couldn't find desired channel");
                    return;
                }
                targetChannel = targetChannelTemp.members;
                target = 'all'
            } else {
              target = common.GetUserID(targetTemp, message);
                if (!target){
                    message.reply(" couldn't find desired user!");
                    common.logerror(message, this.name, "couldn't find desired user");
                    return;
                }  
            }
        }

        //set time and sanitize
        let timeTemp = common.ArgsToString(args);
        timeTemp = Number(timeTemp);
        if (!timeTemp || !math.isNumeric(timeTemp) || timeTemp > 10){
            time = 5000;
        } else {
            timeTemp = math.ceil(timeTemp);
            time = (timeTemp * 1000);
        }

        function ToggleMute(target){
            if (!target.voice.channel){
                message.reply(" that user isn't in vc you monkey");
                common.logerror(message, this.name, "user not in vc")
                return false;
            }
            let isMuted = target.voice.serverMute
            if (!isMuted){
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
            if (!done){
                return;
            }
            await sleep(ms);
            ToggleMute(target);
          }

        //mutes user(s) based on target type
        if(target == 'all'){
            for(let [snowflake, guildMember] of targetChannel){
                PlsShutUp(guildMember, time);
                message.channel.send(`**${guildMember.user.tag}** has been silenced for **${(time / 1000)}s**`);
            }
            common.logsuccess(message, this.name, `target: ${target} channel: ${targetChannelTemp.name} time: ${time}ms`);
          } else {
            PlsShutUp(target, time);
            message.channel.send(`**${target.user.tag}** has been silenced for **${(time / 1000)}s**`);
            common.logsuccess(message, this.name, `target: ${target.user.tag} time: ${time}ms`);
        } 
    }
}