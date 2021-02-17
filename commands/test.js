const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "test",
    description: "grabs pfp of user",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Test",
    alias: ["test", "test1", "test2"],
    disabled: false,
    execute(message, args){ 

      let channel = args.shift();

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

      channelReturn = common.GetVcID(channel, message);
      i = channelReturn.name
      console.log(i);


      /*var members = channelReturn.members;
      for (let [snowflake, guildMember] of members){
        console.log(`snowflake: ${snowflake}  id: ${guildMember.id}`);
        PlsShutUp(guildMember, 4000);
      }
      */
          
    }
}