/** EVENTS HANDLER */

module.exports = (client) => {
    client.handleEvents = async(eventFiles, path) => {

        for (const file of eventFiles) {

            const event = require(`../client events/${file}`);

            if (event.once) { // once event
                client.once(event.name, (...args) => event.run(client, ...args));
            } else { // on event
                client.on(event.name, (...args) => event.run(client, ...args));
            };

        };
    };
};