const common = require('../common');
const Discord = require('discord.js');
const math = require(`mathjs`);

module.exports = {
    name: "shutuptest",
    description: "server mutes the targeted user",
    usage: `\`${process.env.PREFIX}shutup @user\``,
    category: "General",
    alias: ["shutuptest"],
    disabled: false,
    execute(message, args){ 

        let comname = "shutup";
        if (message.author != process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            common.logerror(message, comname, "invalid permision");
            return;
        }

        
        let time;
        let target;
        let targetChannel;
        let vcList;

        let targetTemp = args.shift();
        console.log(targetTemp);

        if (!targetTemp){
            message.reply(" specify a person you monkey");
            common.logerror(message, comname, "no specified user");
            return;
        } else {
            if(targetTemp == "all") {
                target = "all"
                targetChannel = common.GetVcID(args.shift())
                if (!targetChannel){
                    message.reply(" couldn't find desired channel!");
                    common.logerror(message, comname, "couldn't find desired channel");
                    return;
                }
                vcList = targetChannel.members;
                vcList = vcList.array();
                console.log(vcList);
            } else {
                target = common.GetUserID(targetTemp, message);
                if (!target){
                    message.reply(" couldn't find desired user!");
                    common.logerror(message, comname, "couldn't find desired user");
                    return;
                }
            }
        }

        

        let timeTemp = common.ArgsToString(args);
        timeTemp = Number(timeTemp);
        if (!timeTemp || !math.isNumeric(timeTemp) || timeTemp > 10){
            time = 5000;
        } else {
            time = (timeTemp * 1000);
        }

        function ToggleMute(target){
            if (!target.voice.channel){
                message.reply(" that user isn't in vc you monkey");
                common.logerror(message, comname, "user not in vc")
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


          PlsShutUp(target, time);
          message.channel.send(`**${target.user.tag}** has been silenced for **${(time / 1000)}s**`);
          common.logsuccess(message, comname, `user = ${target.user.tag} time = ${time}ms`);

    }
}