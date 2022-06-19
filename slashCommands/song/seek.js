/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SEEK SLASH COMMAND */

module.exports = {
    name: 'seek',
    description: 'przewinięcie utworu do podanego czasu (w sekundach)',

    options: [{
        name: 'value',
        description: 'Podaj liczbę sekund, do którego momentu chcesz przewinąć utwór',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        const value = msgInt.options.getNumber('value');

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

        /** OTHER ERRORS */

        const song = queue.songs[0]; // now playing song

        if (song.isLive) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przewijać transmisji na żywo!')
                ],
                ephemeral: true,
            });
        };

        if (!value) value = 0; // seek seconds
        const number = Number(value);

        if (!value) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz jeszcze wpisać, **do której sekundy** chcesz przewinąć utwór!')
                ],
                ephemeral: true,
            });
        };

        if (isNaN(number) || number > queue.songs[0].duration || number === 0) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość *(w sekundach)*!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        client.distube.seek(msgInt, number); // execute command

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\``)
            ],
        });

    },
};