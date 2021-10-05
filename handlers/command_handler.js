const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

module.exports = (client, Discord) => {
    client.commands = new Collection();

    const loadFiles = (dirPath, collection) => {
        const files = fs.readdirSync(dirPath);

        for (const file of files) {
            if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
                loadFiles(`${dirPath}/${file}`, collection);
            } else {
                const command = require(path.join('../', dirPath, file));
                command.category = dirPath.slice(dirPath.lastIndexOf('/') + 1);
                console.log(command.category);
                if (command.name) collection.set(command.name, command);
            }
        }
    }
    loadFiles(`./commands`, client.commands);
}

