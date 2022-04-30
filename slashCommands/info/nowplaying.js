/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/** NOWPLAYING SLASH COMMAND */

module.exports = {
    name: 'nowplaying',
    description: 'Informacje o odtwarzanym utworze',

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;


    },
};