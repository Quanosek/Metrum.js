/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** RADIO SLASH COMMAND */

module.exports = {
    name: 'radio',
    description: 'auto-odtwarzanie podobnych utworów (radio utworu)',

    options: [{
        name: 'mode',
        description: 'Wybierz tryb działania radia',
        type: 'NUMBER',
        choices: [{
                name: 'enable',
                value: 1,
            },
            {
                name: 'disable',
                value: 0,
            }
        ],
    }],

    async run(client, msgInt) {

        const choice = msgInt.options.getNumber('mode');

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

        let mode = client.distube.toggleAutoplay(msgInt);

        if (!choice) {
            mode = mode ? '**Włączono**' : '**Wyłączono**';

        } else {
            queue.autoplay = choice;
            if (choice === 0) mode = '**Wyłączono**';
            if (choice === 1) mode = '**Włączono**';
        };

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('📻 | ' + mode + ' auto-odtwarzanie (radio utworu).')
            ],
        });

    },
};