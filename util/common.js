const colors = require('colors');

function GetUserID(input, message){
    let newInput = input.toString().toLowerCase();
    let user = message.guild.members.cache.get(input);

    if (!user) user = message.guild.members.cache.filter(u => u.displayName.toLowerCase().includes(newInput)).first();
    if (!user) user = message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(newInput)).first();
    if (!user) if (message.mentions.users.size) user = message.guild.members.cache.get(message.mentions.users.first().id);
    return user;
}

function GetVcID(input, message){
    let vc = message.guild.channels.cache.get(input);

    if (vc == null) vc = message.guild.channels.cache.filter(channel => channel.name.toLowerCase().includes(input) && channel.type === "voice").first();
    return vc;
}

function ArgsToString(args){
    newArgs = args.length > 1 ? args.join(" ") : args;
    return String(newArgs);
}

function PermissionCheck(target, permission){
    return (hasPermission = permission => target.hasPermission(permission));
}

module.exports = {
    GetUserID,
    GetVcID,
    ArgsToString,
    PermissionCheck
    }