/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { Permissions, MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'jump',
    aliases: ['jp', 'j'],
    description: 'pominięcie podanej liczby utworów w kolejce (domyślnie +1)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));

        };

        if (!args[0]) args[0] = 1;
        let number = Number(args[0]);

        if (isNaN(number) || number > queue.songs.length || number === 0) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        if (queue.songs.length <= 2) {
            if (queue.autoplay === true) { client.distube.skip(msg) } else { client.distube.stop(msg) };
        } else { client.distube.jump(msg, number) };

        let songs;
        let rest = number % 10;

        // number is < 0

        if (number > 0) {

            if (number === 1) songs = 'utwór'
            else if (rest < 2 || rest > 4) songs = 'utworów'
            else if (rest > 1 || rest < 5) songs = 'utwory'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription(`⏭️ | Pominięto **${number}** ${songs}.`)
                ]
            });

        } else {

            // number is > 0

            fixedNumber = -number

            if (fixedNumber === 1) songs = 'utwór'
            else if (rest < 2 || rest > 4) songs = 'utworów'
            else if (rest > 1 || rest < 5) songs = 'utwory'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription(`⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`)
                ]
            });

        };

    }
};