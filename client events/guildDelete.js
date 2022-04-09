const clr = require('colors');

const realDate = require('../functions/realDate.js')


// const Database = require('@replit/database')
// const db = new Database()



module.exports = {
    name: 'guildDelete',

    async execute(client, guild) {


        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${guild.name}, ${guild.id}\n>> Bot ` + clr.brightRed(`left`) + ` the server!`);


        // if (db.get(`prefix_${guild.id}`)) { await db.delete(`prefix_${guild.id}`) }

    }
};