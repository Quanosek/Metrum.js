/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** CLEAR SLASH COMMAND */

module.exports = {
    name: 'clear',
    description: 'Wyczyszczenie całej kolejki (łącznie z obecnie granym utworem)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;


    },
};