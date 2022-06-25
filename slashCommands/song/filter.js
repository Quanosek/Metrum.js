/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FILTER SLASH COMMAND */

module.exports = {
    name: 'filter',
    description: 'Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru, wyłączy go)',

    options: [{
        name: 'choice',
        description: 'Wybierz filtr',
        type: 'STRING',
        required: true,
        choices: [
            { name: 'disable', value: 'disable' },
            { name: '3d', value: '3d' },
            { name: 'bassboost', value: 'bassboost' },
            { name: 'echo', value: 'echo' },
            { name: 'karaoke', value: 'karaoke' },
            { name: 'nightcore', value: 'nightcore' },
            { name: 'vaporwave', value: 'vaporwave' },
            { name: 'flanger', value: 'flanger' },
            { name: 'gate', value: 'gate' },
            { name: 'haas', value: 'haas' },
            { name: 'reverse', value: 'reverse' },
            { name: 'surround', value: 'surround' },
            { name: 'mcompand', value: 'mcompand' },
            { name: 'phaser', value: 'phaser' },
            { name: 'tremolo', value: 'tremolo' },
            { name: 'earwax', value: 'earwax' }
        ],
    }],

    async run(client, msgInt) {

        const choice = msgInt.options.getString('choice');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
                ephemeral: true,
            });
        };

        if (!uservoice || botvoice != uservoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
                ephemeral: true,
            });
        };

        if (!queue) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        if (choice === 'disable') {
            client.distube.setFilter(msgInt, false);

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🪄 | **Wyłączono** wszystkie filtry.')
                ],
            });
        };

        const filter = client.distube.setFilter(msgInt, choice);

        if (filter.length === 0) {
            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🪄 | Żaden filtr **nie jest aktywny**.')
                ],
            });
        };

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🪄 | **Włączone filtry**: ' + (filter.join(', ')))
            ],
        });

    },
};