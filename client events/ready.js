/* <--- Import ---> */

require('dotenv').config();
const ms = require('ms');
const clr = require('colors');
const { getVoiceConnection } = require('@discordjs/voice');

const realDate = require('../functions/realDate.js')


/* <--- Event ---> */

module.exports = {
    name: 'ready',

    execute(client) {

        /* <--- on-ready ---> */

        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Bot logged in successfully.\n`);
        client.user.setActivity(`@Metrum`, { type: 'LISTENING' });

        /* <--- auto-leave voice channels ---> */

        const guildsID = client.guilds.cache.map(guild => guild.id);

        setInterval(() => {

            guildsID.forEach(id => {

                const connection = getVoiceConnection(id)
                const queue = client.distube.getQueue(id);

                if (connection && !queue) { connection.destroy() };

            })
        }, ms('10min'));

    }
};