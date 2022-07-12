/** IMPORT */

const ms = require('ms');
require('colors');
const { getVoiceConnection } = require('@discordjs/voice');

const realDate = require('../functions/realDate.js');

/** READY EVENT */

module.exports = {
    name: 'ready',
    once: true, // only once

    async run(client) {

        // on ready log
        console.log(realDate() + ' Bot is ready to use!'.brightYellow);

        // auto-leave voice channels
        const guildsID = client.guilds.cache.map(guild => guild.id);

        setInterval(() => {
            guildsID.forEach(id => {
                const connection = getVoiceConnection(id)
                const queue = client.distube.getQueue(id);

                if (connection && !queue) { connection.destroy() };
            });
        }, ms('10m'));

    },
};