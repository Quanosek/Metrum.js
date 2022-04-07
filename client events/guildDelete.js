/* <--- Import ---> */

const clr = require('colors');

const realDate = require('../functions/realDate.js')

const Database = require('@replit/database')
const db = new Database()


/* <--- Event ---> */

module.exports = {
    name: 'guildDelete',

    async execute(client, guild) {

        /* <--- delete log ---> */

        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${guild.name}, ${guild.id}\n>> Bot ` + clr.brightRed(`left`) + ` the server!`);

        /* <--- db-prefix delete ---> */

        if (db.get(`prefix_${guild.id}`)) { await db.delete(`prefix_${guild.id}`) }

    }
};