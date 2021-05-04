const common = require('../common.js');
const Discord = require ('discord.js');

module.exports = {
    name: "move",
    description: "move a single user to a vc or all users in one vc",
    usage: `\`${process.env.PREFIX}move <target> <vc1> <vc2>\``,
    category: "General",
    alias: ["move", "moveall"],
    disabled: false,
    execute(message, args){ 
        //permision check
        if (!(message.author.id == process.env.OWNERID || message.member.hasPermission('MOVE_MEMBERS', 'ADMINISTRATOR'))){
            message.reply(" you don't have the permission to call this!");
            common.logerror(message, this.name, "invalid permision");
            return;
        }

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
            common.logerror(message, this.name, "couldn't find desired user");
            return;
            }
            if(!target.voice.channel){
            message.reply(" user is not in a VC!");
            common.logerror(message, this.name, "target not connected to voice");
            return;
            }
            destinationVCTemp = args.shift();
            destinationVCTemp = common.GetVcID(destinationVCTemp, message);
            if(!destinationVCTemp){
            message.reply(" couldn't find desired channel!");
            common.logerror(message, this.name, "couldn't find desired channel");
            return;
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