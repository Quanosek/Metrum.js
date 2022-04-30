/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH } = process.env;

const { MessageEmbed } = require('discord.js');

/** QUEUE SLASH COMMAND */

module.exports = {
    name: 'queue',
    description: 'Informacje o kolejce utworów',

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;


    },
};