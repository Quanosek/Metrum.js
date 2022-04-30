/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

/** JUMP SLASH COMMAND */

module.exports = {
    name: 'jump',
    description: 'Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;


    },
};