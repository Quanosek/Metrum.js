/* <--- Import ---> */

const clr = require('colors');

const config = require('../bot/config.js').config();
const realDate = require('../functions/realDate.js')


/* <--- Event ---> */

module.exports = {
    name: 'voiceStateUpdate',

    execute(client, oldState, newState) {

        if (oldState.id === config.id) {
            if (!oldState.channelId && newState.channelId) {

                console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${oldState.guild.name}, ${oldState.guild.id}\n>> Bot ` + clr.brightGreen(`joined`) + ` the voice channel.`);

            } else if (!newState.channelId) {

                console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${newState.guild.name}, ${newState.guild.id}\n>> Bot ` + clr.brightRed(`left`) + ` the voice channel.`);

            };
        };

    }
};