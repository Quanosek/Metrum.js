/** IMPORT */

require('dotenv').config();
const { REGISTER, GUILD_ID } = process.env;

require('colors');
const fs = require('fs');

const realDate = require('../functions/realDate.js');

/** SLASH COMMANDS HANDLER */

module.exports = (client) => {
    client.handleSlashCommands = async(slashCommandsFolders, path) => {

        const slashCommandsArray = [];

        /** search for commands files */

        for (folder of slashCommandsFolders) {
            const commandFiles = fs
                .readdirSync(`${path}/${folder}`)
                .filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {

                const cmd = require(`../slashCommands/${folder}/${file}`);

                if (!cmd.name) return;
                client.slashCommands.set((cmd.name), cmd); // run command

                if (cmd.userPermissions) cmd.defaultPermission = false; // permissions
                slashCommandsArray.push(cmd); // save command

            };
        };

        client.on('ready', async() => {

            /** register slash commands */

            try {
                console.log(realDate() + ' Started refreshing slash commands.');

                if (REGISTER === 'globally') { // globaly

                    // await guild.commands.set([]);
                    // console.log(realDate() + ' Deleted all local slash commands.');

                    await client.application.commands.set(slashCommandsArray);
                    console.log(realDate() + ' Registered all slash commands ' + 'globally'.underline + '.');

                } else if (REGISTER === 'locally') { // locally

                    // await client.application.commands.set([]);
                    // console.log(realDate() + ' Deleted all global slash commands.');

                    const guild = client.guilds.cache.get(GUILD_ID);

                    await guild.commands.set(slashCommandsArray).then((cmd) => {

                        /** permissions check */

                        const getRoles = (commandName) => {
                            const permissions = slashCommandsArray.find(x => x.name === commandName).userPermissions;

                            if (!permissions) return null;
                            return guild.roles.cache.filter(x => x.permissions.has(permissions) && !x.managed);
                        };

                        const fullPermissions = cmd.reduce((accumulator, role) => {
                            const roles = getRoles(role.name);
                            if (!roles) return accumulator;

                            const permissions = roles.reduce((a, r) => {
                                return [...a, { id: r.id, type: 'ROLE', permission: true }];
                            }, []);

                            return [...accumulator, { id: role.id, permissions }];
                        }, []);

                        guild.commands.permissions.set({ fullPermissions });
                    });

                    console.log(realDate() + ' Registered all slash commands ' + 'locally'.underline + '.');

                } else {
                    console.log(' >>> Wrong process.env.ENV value!'.brightRed);
                };

            } catch (err) {
                if (err) console.error(` >>> ${err}`.brightRed);
            };

        });
    };
};