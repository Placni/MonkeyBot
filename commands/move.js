const common = require('../util/common');
const Discord = require('discord.js');

module.exports = {
    name: "move",
    description: "move a single user to a vc or all users in one vc",
    usage: `\`${process.env.PREFIX}move <target> <vc1> <vc2>\``,
    category: "General",
    alias: ["move", "moveall"],
    disabled: false,
    permission: ['MOVE_MEMBERS'],
    execute(message, args){ 
        //TODO:
        //rewrite this please god bless

        if (!args[0]) return message.reply(" specify a target you monkey");
        //init vars
        let origVCMembers
        var origVCTemp
        let destinationVCTemp
        var destinationVC
        let target = args.shift();

        //check what the user wants to target (all or single user); as well as channel(s)
        if (target == 'all'){
            origVCTemp = args.shift();
            origVCTemp = common.GetVcID(origVCTemp, message);
            destinationVCTemp = args.shift();
            destinationVCTemp = common.GetVcID(destinationVCTemp, message);
            if (!origVCTemp || !destinationVCTemp){
            message.reply(" couldn't find desired VC(s)!");
            common.logerror(message, this.name, "couldn't find desired channel(s)");
            return;
            }

            origVCMembers = origVCTemp.members;
            destinationVC = destinationVCTemp;
            target = 'all'
        } else {
            target = common.GetUserID(target, message);
            if(!target){
            message.reply(" couldn't find desired user!");
            return common.logerror(message, this.name, "couldn't find desired user");
            }
            if(!target.voice.channel){
            message.reply(" user is not in a VC!");
            return common.logerror(message, this.name, "target not connected to voice");
            }
            destinationVCTemp = args.shift();
            destinationVCTemp = common.GetVcID(destinationVCTemp, message);
            if(!destinationVCTemp){
            message.reply(" couldn't find desired channel!");
            return common.logerror(message, this.name, "couldn't find desired channel");
            }
            destinationVC = destinationVCTemp;
        }

        //move single target or all based on target
        if (target == 'all'){
            for(let [snowflake, guildMember] of origVCMembers){
            guildMember.voice.setChannel(destinationVC);
            message.channel.send(` **${guildMember.user.tag}** has been moved from **${origVCTemp.name}** to **${destinationVCTemp.name}**`);
            }
            common.logsuccess(message, this.name, `target: ${target} origVC: ${origVCTemp.name} destVC: ${destinationVCTemp.name}`);
        } else {
            let old = target.voice.channel;
            target.voice.setChannel(destinationVC);
            message.channel.send(` **${target.user.tag}** has been moved from **${old.name}** to **${destinationVCTemp.name}**`);
            common.logsuccess(message, this.name, `target: ${target.user.tag} origVC: ${old.name} destVC: ${destinationVCTemp.name}`);
        }
    }
}