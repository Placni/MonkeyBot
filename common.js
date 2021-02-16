const colors = require('colors');

function logerror(message, comname, error){
    let author = message.author.tag;
    console.log(colors.red(author + " called ") + colors.cyan(comname) + colors.red(" unsuccessfuly with error: " + error));
}

function logsuccess(message, comname, xtra){
    let author = message.author.tag;
    console.log(colors.green(author + " called ") + colors.cyan(comname) + colors.green(" successfully: " + xtra));
}

module.exports = {
    logerror,
    logsuccess
    }