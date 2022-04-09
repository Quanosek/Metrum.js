/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'rewind',
    aliases: ['rw'],
    category: 'song',
    description: 'przewinięcie utworu **do tyłu** o podaną liczbę sekund (domyślnie +10)',

    async run(client, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        const song = queue.songs[0];

        if (song.isLive) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie można przewijać transmisji na żywo!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!args[0]) args[0] = 10;
        let number = Number(args[0]);

        if (isNaN(number) || number > queue.currentTime || number === 0) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        const seekTime = queue.currentTime - number;

        if (seekTime < 0) seekTime = 0;
        if (seekTime >= queue.songs[0].duration - queue.currentTime) seekTime = 0;

        client.distube.seek(msg, seekTime);

        let seconds;
        let rest = number % 10;

        // number is < 0

        if (number > 0) {

            if (number === 1) seconds = 'sekundę'
            else if (rest < 2 || rest > 4) seconds = 'sekund'
            else if (rest > 1 || rest < 5) seconds = 'sekundy'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription(`⏪ | Przewinięto utwór o \`${fixedNumber}\` ${seconds} **do tyłu** (\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}\`).`)
                ]
            });

        } else {

            // number is > 0

            fixedNumber = -number

            if (fixedNumber === 1) seconds = 'sekundę'
            else if (rest < 2 || rest > 4) seconds = 'sekund'
            else if (rest > 1 || rest < 5) seconds = 'sekundy'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription(`⏩ | Przewinięto utwór o \`${number}\` ${seconds} **do przodu** (\`${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}\`).`)
                ]
            });

        };

    }
};