const common = require('../common');
const Discord = require('discord.js');

module.exports = {
    name: "shutup",
    description: "server mutes the targeted user",
    usage: `\`${process.env.PREFIX}shutup @user\``,
    category: "General",
    alias: ["shutup"],
    disabled: false,
    execute(message, args){ 
        if (message.author != process.env.OWNERID){
            message.reply(" you must be the owner to call this!");
            common.logerror(message, comname, "invalid permision");
            return;
        }
        let comname = "shutup";
        let argString = common.ArgsToString(args);
        let target;

        if (!argString){
            message.reply(" specify a person you monkey");
            return;
        } else {
            target = common.GetUserID(argString, message);
            if (!target){
                message.reply(" couldn't find desired user!");
                common.logerror(message, comname, "couldn't find desired user");
                return;
            }
        }

        function ToggleMute(target){
            let isMuted = target.voice.mute
            if (!isMuted){
                target.voice.setMute(true, "");
            } else {
                target.voice.setMute(false, "");
            }
        }
        function sleep(ms) {
            return new Promise((resolve) => {
              setTimeout(resolve, ms);
            });
          }
        async function PlsShutUp(target, ms) {
            ToggleMute(target);
            await sleep(ms);
            ToggleMute(target);
          }

          PlsShutUp(target, 3000);

    }
}