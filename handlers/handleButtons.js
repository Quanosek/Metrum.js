/** IMPORT */

require('colors');

/** BUTTONS HANDLER */

module.exports = (client) => {
    client.handleButtons = async(buttonFiles, path) => {

        for (const file of buttonFiles) {

            const button = require(`../buttons/${file}`);
            client.buttons.set(button.name, button);

        };
    };
};