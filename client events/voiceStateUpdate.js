/* <--- Import ---> */

require('dotenv').config();

require('colors');

const realDate = require('../functions/realDate.js')


/* <--- Event ---> */

module.exports = {
    name: 'voiceStateUpdate',

    async run(client, oldState, newState) {

        if (oldState.id === process.env.ID) {
            if (!oldState.channelId && newState.channelId) {

                console.log(realDate() + ` Guild: ${oldState.guild.name}, ${oldState.guild.id}\n > Bot ` + `joined`.brightGreen + ` the voice channel.`);

            } else if (!newState.channelId) {

                console.log(realDate() + ` Guild: ${newState.guild.name}, ${newState.guild.id}\n > Bot ` + `left`.brightRed + ` the voice channel.`);

            };
        };

    }
};