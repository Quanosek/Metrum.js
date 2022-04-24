/** IMPORT */

const fs = require('fs');

/** COMMANDS HANDLER */

module.exports = (client) => {
    client.handleCommands = async(commandFolders, path) => {

        for (folder of commandFolders) {

            /** search for commands files */

            const commandFiles = fs
                .readdirSync(`${path}/${folder}`)
                .filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const cmd = require(`../commands/${folder}/${file}`);

                client.commands.set((cmd.name), cmd); // run command
            };

        };
    };
};