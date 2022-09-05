// Returns the guildMember object that matches string input
async function findMember(input, message) {
    if (!input) return;
    input = input.toString();
    const members = await message.guild.members.search({ query: input, limit: 1 });
    let member = members?.first();
    if (!member) {
        const filter = input.match(/^<@!?(\d+)>$/);
        if (!filter) return;
        member = message.guild.members.cache.get(filter[1]);
    }
    return member;
}

// Returns any Discord channel object that matches string input
function findChannel(input, message) {
    if (!input) return;
    const filter = input?.match(/^<#(\d+)>$/);
    if (filter) return message.guild.channels.cache.get(filter[1]);
}

// Returns the Discord voiceChannel object that matches string input
function findVC(input, message) {
    if (!input) return;
    input = input.toLowerCase();
    let vc = message.guild.channels.cache.get(input);
    if (!vc) {
        const filter = input.match(/^<#(\d+)>$/);
        if (filter) vc = message.guild.channels.cache.get(filter[1]);
    }
    if (!vc) {
        vc = message.guild.channels.cache
            .filter(c => c.name.toLowerCase().includes(input) && c.type === "GUILD_VOICE")
            .first();
    }
    return vc;
}

// Converts our normal args array into a string
function ArgsToString(args) {
    const newArgs = args.length > 1 ? args.join(" ") : args;
    return String(newArgs);
}

// Returns what permissions a user has
function PermissionCheck(message) {
    return message.member.permissionsIn(message.channel).toArray();
}

// Breaks down seconds into a string formatted HH:MM:SS
function hhmmss(secs) {
    let mins = Math.floor(secs / 60);
    secs = Math.floor(secs % 60);
    const hrs = Math.floor(mins / 60);
    mins = mins % 60;
    return `${hrs}h ${mins}m ${secs}s`;
}

// Sanitizes user input strings
// First denotes whether to only return first word or the entire string
function sanitizeString(str, first) {
    str = str.replace(/[^a-z0-9áéíóúñü .,_-]/gim, "");
    if(first) {
        return (str.match(/^(\S+)\s(.*)/))
            ? str = str.match(/^(\S+)\s(.*)/).at(1)
            : str;
    }
    return str.trim();
}

module.exports = {
    findMember,
    findVC,
    findChannel,
    ArgsToString,
    PermissionCheck,
    hhmmss,
    sanitizeString,
};