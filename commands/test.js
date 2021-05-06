const common = require('../util/common');
const Discord = require('discord.js');
const math = require('mathjs');

module.exports = {
    name: "test",
    description: "a test command!",
    usage: `\`${process.env.PREFIX}test\``,
    category: "Admin",
    alias: ["test", "test1", "test2"],
    disabled: false,
    execute(message, args){ 
        let targetChannel = common.GetVcID(args.shift(), message);
        let vc = message.member.voice.channel;
        console.log(targetChannel.members.size);
    }
}