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

        /** OTHER ERRORS */

        const song = queue.songs[0]; // now playing song

        if (song.isLive) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przewijać transmisji na żywo!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!args[0]) args[0] = 10; // rewind seconds
        let number = Number(args[0]);

        if (isNaN(number) || number > queue.currentTime || number === 0) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        const seekTime = queue.currentTime - number;

        if (seekTime < 0) seekTime = 0;
        if (seekTime >= queue.songs[0].duration - queue.currentTime) seekTime = 0;

        client.distube.seek(msg, seekTime); // execute command

        let seconds;
        let rest = number % 10;

        // number is < 0

        if (number > 0) {

            if (number === 1) seconds = 'sekundę'
            else if (rest < 2 || rest > 4) seconds = 'sekund'
            else if (rest > 1 || rest < 5) seconds = 'sekundy'

            return msg.channel.send({
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

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⏩ | Przewinięto utwór o \`${fixedNumber}\` ${seconds} **do przodu** (\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}\`).`)
                ],
            });

        };

    },
};