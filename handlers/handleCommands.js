/** IMPORT */

const fs = require('fs');

const { Collection } = require('discord.js');

/** COMMANDS HANDLER */

module.exports = (client) => {
    client.handleCommands = async(path) => {

        client.commands = new Collection();
        const allFolders = fs.readdirSync(`./${path}`);

        for (folder of allFolders) {
            const allFiles = fs
                .readdirSync(`./${path}/${folder}`)
                .filter(file => file.endsWith('.js'))

            for (file of allFiles) {
                const cmd = require(`../${path}/${folder}/${file}`);
                client.commands.set((cmd.name), cmd);
            };
        };

    };
};