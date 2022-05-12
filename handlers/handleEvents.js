/** IMPORT */

const fs = require('fs');

/** EVENTS HANDLER */

module.exports = (client) => {
    client.handleEvents = async(path) => {

        const allFiles = fs
            .readdirSync(`./${path}`)
            .filter(file => file.endsWith('.js'))

        for (file of allFiles) {
            const event = require(`../${path}/${file}`);

            if (event.once) { // once event
                client.once(event.name, (...args) => event.run(client, ...args));
            } else { // on event
                client.on(event.name, (...args) => event.run(client, ...args));
            };
        };

    };
};