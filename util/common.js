const colors = require('colors');

function logerror(message, comname, error){
    let author = message.author.tag;
    console.log(colors.red(author + " called ") + colors.cyan(comname) + colors.red(" with error: " + error));
}

function logsuccess(message, comname, xtra){
    let author = message.author.tag;
    console.log(colors.green(author + " called ") + colors.cyan(comname) + colors.green(" successfully: " + xtra));
}

function GetUserID(input, message){
    let newInput = input.toString().toLowerCase();
    let user = message.guild.members.cache.get(input);

    //from displayname
    if (!user) {
        user = message.guild.members.cache.filter(u => u.displayName.toLowerCase().includes(newInput)).first();
    }
    //by username
    if (!user) {
        user = message.guild.members.cache.filter(u => u.user.username.toLowerCase().includes(newInput)).first();
    }
    //from mention
    if (!user) {
        if (message.mentions.users.size) {
            user = message.guild.members.cache.get(message.mentions.users.first().id);
        }
    }
    return user;
}

function GetVcID(input, message){
    let vc = message.guild.channels.cache.get(input);

    if (vc == null){
        vc = message.guild.channels.cache.filter(channel => channel.name.toLowerCase().includes(input) && channel.type === "voice").first();
    }
    return vc;
}

function ArgsToString(args){
    newArgs = args.length > 1 ? args.join(" ") : args;
    return String(newArgs);
}

module.exports = {
    logerror,
    logsuccess,
    GetUserID,
    GetVcID,
    ArgsToString
    }