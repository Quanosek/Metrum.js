/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** REPEAT SLASH COMMAND */

module.exports = {
    name: 'repeat',
    description: 'przełączanie trybów zapętlenia: utworu/kolejki/wyłączone',

    options: [{
        name: 'mode',
        description: 'Wybierz tryb działania zapętlenia',
        type: 'NUMBER',
        choices: [{
                name: 'song',
                value: 1,
            },
            {
                name: 'queue',
                value: 2,
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

        let mode = client.distube.setRepeatMode(msgInt);

        if (!choice) {
            mode = mode ? mode === 2 ? '🔁 | Włączono zapętlanie **kolejki**.' : '🔂 | Włączono zapętlanie **utworu**.' : '🔁 | **Wyłączono** zapętlanie.';

        } else {
            queue.repeatMode = choice;
            if (choice === 0) mode = '🔁 | **Wyłączono** zapętlanie.';
            if (choice === 1) mode = '🔂 | Włączono zapętlanie **utworu**.';
            if (choice === 2) mode = '🔁 | Włączono zapętlanie **kolejki**.';
        };

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(mode)
            ],
        });

    },
};