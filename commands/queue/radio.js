/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** RADIO COMMAND */

module.exports = {
    name: 'radio',
    aliases: ['r'],
    description: 'Autoodtwarzanie podobnych utworów (radio utowru)',

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

            const mode = client.distube.toggleAutoplay(msg); // execute command

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('📻 | ' + (mode ? '**Włączono**' : '**Wyłączono**') + ' autoodtwarzanie (radio utworu).')
                ],
            });

        } catch (err) {
            console.error(err);
        };
    },
};