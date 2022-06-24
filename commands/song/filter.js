/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FILTER COMMAND */

module.exports = {
    name: 'filter',
    aliases: ['f'],
    description: 'Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru, wyłączy go)',

    async run(client, prefix, msg, args) {

        const choice = args[0];
        const modes = [
            'disable',
            '3d',
            'bassboost',
            'echo',
            'karaoke',
            'nightcore',
            'vaporwave',
            'flanger',
            'gate',
            'haas',
            'reverse',
            'surround',
            'mcompand',
            'phaser',
            'tremolo',
            'earwax'
        ];

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        if (modes.includes(choice)) {

            msg.react('✅');

            if (choice === 'disable') {
                client.distube.setFilter(msg, false);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription('🪄 | **Wyłączono** wszystkie filtry.')
                    ],
                });
            };

            const filter = client.distube.setFilter(msg, choice);

            if (filter.length === 0) {
                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription('🪄 | Żaden filtr **nie jest aktywny**.')
                    ],
                });
            };

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('🪄 | **Włączone filtry**: ' + (filter.join(', ')))
                ],
            });

        };

    },
};