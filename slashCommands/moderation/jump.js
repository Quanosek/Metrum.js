/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** JUMP SLASH COMMAND */

module.exports = {
    name: 'jump',
    description: 'Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'number',
        description: 'Podaj liczbę, ile utworów chcesz pominąć',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        let number = msgInt.options.getNumber('number');
        if (!number) number = 1; // default value

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

        /** OTHER ERROR */

        if (isNaN(number) || number > queue.songs.length || number === 0) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        if (queue.songs.length <= 2) {
            if (queue.autoplay === true) client.distube.skip(msgInt)
            else client.distube.stop(msgInt);
        } else client.distube.jump(msgInt, number);

        let songs, rest = number % 10;
        const abs = Math.abs(number);

        if (abs === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        if (number > 0) text = `⏭️ | Pominięto **${number}** ${songs}.`;
        else text = `⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`;

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text)
            ],
        });

    },
};