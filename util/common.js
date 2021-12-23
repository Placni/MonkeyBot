const colors = require('colors');

async function findMember(input, message){
    if(!input) return;
    input = input.toString();
    const members = await message.guild.members.search({query: input, limit: 1});
    let member = members?.first();
    if(!member){
        const filter = input.match(/^<@!?(\d+)>$/);
        if(!filter) return;
        member = message.guild.members.cache.get(filter[1]);
    }
    return member;
}

function findChannel(input, message){
    if(!input) return;
    const filter = input?.match(/^<#(\d+)>$/);
    if (filter) return message.guild.channels.cache.get(filter[1]);
}

function findVC(input, message){
    if(!input) return;
    input = input.toLowerCase();
    let vc = message.guild.channels.cache.get(input);
    if(!vc){
        const filter = input.match(/^<#(\d+)>$/);
        if (filter) vc = message.guild.channels.cache.get(filter[1]);
    }
    if(!vc){
        vc = message.guild.channels.cache
            .filter(c => c.name.toLowerCase().includes(input) && c.type === "GUILD_VOICE")
            .first();
    }
    return vc;
}

function ArgsToString(args){
    newArgs = args.length > 1 ? args.join(" ") : args;
    return String(newArgs);
}

function PermissionCheck(message, permission){
    return message.member.permissionsIn(message.channel).toArray();
}

module.exports = {
    findMember,
    findVC,
    findChannel,
    ArgsToString,
    PermissionCheck
    }