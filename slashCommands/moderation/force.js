/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FORCE SLASH COMMAND */

module.exports = {
    name: 'force',
    description: 'Wymuszenie użycia komendy (poza kolejnością)',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
            name: 'leave',
            description: 'wymuszenie wyjścia z kanału głosowego',
            type: 'SUB_COMMAND',
        },
        {
            name: 'play',
            description: 'wymuszenie puszczenia podanego utworu',
            type: 'SUB_COMMAND',
        },
        {
            name: 'skip',
            description: 'wymuszenie pominięcia utworu',
            type: 'SUB_COMMAND',
        },
    ],

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;


    },
};