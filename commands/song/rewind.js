/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** REWIND COMMAND */

module.exports = {
    name: 'rewind',
    aliases: ['rw'],
    description: 'Przewinięcie utworu do tyłu o podaną liczbę sekund (domyślnie: 10)',

    async run(client, prefix, msg, args) {

        let number = Number(args[0]);
        if (!args[0]) number = 10; // default value

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

        /** OTHER ERRORS */

        const song = queue.songs[0]; // now playing song

        if (song.isLive) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przewijać transmisji na żywo!')
                ],
            }).then(msg => autoDelete(msg));
        };

        let seekTime = queue.currentTime - number;

        if (isNaN(number) || number === 0) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        if (seekTime < 0) seekTime = 0;
        else if (seekTime >= song.duration) seekTime = song.duration - 1;

        client.distube.seek(msg, seekTime); // execute command

        let seconds, rest = number % 10;
        const abs = Math.abs(number);

        if (abs === 1) seconds = 'sekundę'
        else if (rest < 2 || rest > 4) seconds = 'sekund'
        else if (rest > 1 || rest < 5) seconds = 'sekundy'

        if (number > 0) text = `⏪ | Przewinięto utwór o \`${number}\` ${seconds} **do tyłu** (\`${queue.formattedCurrentTime}/${song.formattedDuration}\`).`;
        else text = `⏩ | Przewinięto utwór o \`${abs}\` ${seconds} **do przodu** (\`${queue.formattedCurrentTime}/${song.formattedDuration}\`).`;

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text)
            ],
        });

    },
};