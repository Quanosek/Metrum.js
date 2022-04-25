/** IMPORT */

require('colors');

const realDate = require('../functions/realDate.js');
const schema = require('../schemas/guilds.js');

/** GUILD DELETE EVENT */

module.exports = {
    name: 'guildDelete',

    async run(client, guild) {

        await schema.deleteOne({ guildId: guild.id }); // delete db

        console.log(realDate() + ` Guild: ${guild.name}, ${guild.id}`.grey + `\n >>> Bot ` + `left`.brightRed + ` the server!`); // log

    },
};