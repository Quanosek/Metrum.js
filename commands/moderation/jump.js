/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** JUMP COMMAND */

module.exports = {
    name: 'jump',
    aliases: ['j'],
    description: 'Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        let number = Number(args[0]);

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

        /** OTHER ERROR */

        if (!args[0]) args[0] = 1; // jump number

        if (isNaN(number) || number > queue.songs.length || number === 0) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        if (queue.songs.length <= 2) {
            if (queue.autoplay === true) client.distube.skip(msg)
            else client.distube.stop(msg);
        } else client.distube.jump(msg, number);

        let songs;
        let rest = number % 10;

        // number is < 0

        if (number > 0) {

            if (number === 1) songs = 'utwór'
            else if (rest < 2 || rest > 4) songs = 'utworów'
            else if (rest > 1 || rest < 5) songs = 'utwory'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⏭️ | Pominięto **${number}** ${songs}.`)
                ],
            });

        } else {

            // number is > 0

            fixedNumber = -number

            if (fixedNumber === 1) songs = 'utwór'
            else if (rest < 2 || rest > 4) songs = 'utworów'
            else if (rest > 1 || rest < 5) songs = 'utwory'

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`)
                ],
            });
        };

    },
};