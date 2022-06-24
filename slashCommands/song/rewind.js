/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** REWIND SLASH COMMAND */

module.exports = {
    name: 'rewind',
    description: 'Przewinięcie utworu do tyłu o podaną liczbę sekund (domyślnie: 10)',

    options: [{
        name: 'number',
        description: 'Podaj liczbę sekund, o ile chcesz przewinąć do tyłu',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        let number = msgInt.options.getNumber('number');
        if (!number) number = 10; // default value

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

        let seekTime = queue.currentTime - number;

        if (isNaN(number) || number === 0) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        if (seekTime < 0) seekTime = 0;
        else if (seekTime >= song.duration) seekTime = song.duration - 1;

        client.distube.seek(msgInt, seekTime); // execute command

        let seconds, rest = number % 10;
        const abs = Math.abs(number);

        if (abs === 1) seconds = 'sekundę'
        else if (rest < 2 || rest > 4) seconds = 'sekund'
        else if (rest > 1 || rest < 5) seconds = 'sekundy'

        if (number > 0) text = `⏪ | Przewinięto utwór o \`${number}\` ${seconds} **do tyłu** (\`${queue.formattedCurrentTime}/${song.formattedDuration}\`).`;
        else text = `⏩ | Przewinięto utwór o \`${abs}\` ${seconds} **do przodu** (\`${queue.formattedCurrentTime}/${song.formattedDuration}\`).`;

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text)
            ],
        });

    },
};