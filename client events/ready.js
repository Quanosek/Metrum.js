/* <--- Import ---> */

const { getVoiceConnection } = require('@discordjs/voice');
const ms = require('ms');
const clr = require('colors');

const config = require('../bot/config.js').config();
const realDate = require('../functions/realDate.js')


/* <--- Event ---> */

module.exports = {
    name: 'ready',

    execute(client) {

        /* <--- on-ready ---> */

        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Bot logged in successfully.\n`);
        client.user.setActivity(`@${config.name}`, { type: 'LISTENING' });

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