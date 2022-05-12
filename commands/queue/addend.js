/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** ADD END COMMAND */

module.exports = {
    name: 'addend',
    aliases: ['ae'],
    description: 'Dodanie obecnie granego utworu na koniec kolejki',

    async run(client, prefix, msg, args) {
        try {

            const queue = client.distube.getQueue(msg);
            const botvoice = msg.guild.me.voice.channel;
            const uservoice = msg.member.voice.channel;

            /** COMMON ERRORS */

            if (!botvoice) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Nie jestem na żadnym kanale głosowym!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (!uservoice || botvoice != uservoice) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (!queue) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            /** COMMAND */

            msg.react('✅');

            const song = queue.songs[0]; // now playing song

            return client.distube.play(msg, song.url); // execute command

        } catch (err) {
            console.error(err);
        };
    },
};