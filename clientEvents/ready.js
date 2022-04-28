/** IMPORT */

require('dotenv').config();
const { NAME } = process.env;

require('colors');

const { getVoiceConnection } = require('@discordjs/voice');

const realDate = require('../functions/realDate.js');

/** READY EVENT */

module.exports = {
    name: 'ready',
    once: true, // only once

    async run(client) {

        /** on ready */

        console.log(realDate() + ' Bot is ready!'.brightYellow); // on ready message// on ready message
        // client.user.setActivity(`@${NAME}`, { type: 'LISTENING' }); // bot activity

        /* auto-leave voice channels */

        const guildsID = client.guilds.cache.map(guild => guild.id);

        setInterval(() => {

            guildsID.forEach(id => {
                const connection = getVoiceConnection(id)
                const queue = client.distube.getQueue(id);

                if (connection && !queue) { connection.destroy() };
            });

        }, 600000); // 10 minutes interval

    },
};