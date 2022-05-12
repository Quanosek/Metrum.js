/** IMPORT */

require('colors');
const fs = require('fs');

const { Collection } = require('discord.js');

/** BUTTONS HANDLER */

module.exports = (client) => {
    client.handleButtons = async(path) => {

        client.buttons = new Collection();

        const buttonFiles = fs
            .readdirSync(`./${path}`)
            .filter(file => file.endsWith('.js'))

        for (file of buttonFiles) {
            const button = require(`../${path}/${file}`);
            client.buttons.set(button.name, button);
        };

    };
};