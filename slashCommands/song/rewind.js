/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** REWIND SLASH COMMAND */

module.exports = {
    name: 'rewind',
    description: 'przewinięcie utworu do tyłu o podaną liczbę sekund (domyślnie: 10)',

    options: [{
        name: 'value',
        description: 'Podaj liczbę sekund, o ile chcesz przewinąć do tyłu',
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

        if (!value) value = 10; // rewind seconds
        let number = Number(value);

        if (isNaN(number) || number > queue.currentTime || number === 0) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        const seekTime = queue.currentTime - number;

        if (seekTime < 0) seekTime = 0;
        if (seekTime >= queue.songs[0].duration - queue.currentTime) seekTime = 0;

        client.distube.seek(msgInt, seekTime); // execute command

        let seconds;
        let rest = number % 10;

        // number is < 0

        if (number > 0) {

            if (number === 1) seconds = 'sekundę'
            else if (rest < 2 || rest > 4) seconds = 'sekund'
            else if (rest > 1 || rest < 5) seconds = 'sekundy'

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⏪ | Przewinięto utwór o \`${number}\` ${seconds} **do tyłu** (\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}\`).`)
                ],
            });

        } else {

            // number is > 0

            fixedNumber = -number

            if (fixedNumber === 1) seconds = 'sekundę'
            else if (rest < 2 || rest > 4) seconds = 'sekund'
            else if (rest > 1 || rest < 5) seconds = 'sekundy'

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⏩ | Przewinięto utwór o \`${fixedNumber}\` ${seconds} **do przodu** (\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}\`).`)
                ],
            });

        };

    },
};