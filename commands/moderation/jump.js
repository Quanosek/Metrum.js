/* <--- Import ---> */

require('dotenv').config();
const { Permissions, MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'jump',
    aliases: ['jp', 'j'],
    category: 'moderation',
    description: 'pominięcie podanej liczby utworów w kolejce (domyślnie +1)',

    async run(client, msg, args, prefix) {

        /* <--- moderation ---> */

        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
            !msg.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
        ) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => msgAutoDelete(msg));

        };

        if (!args[0]) args[0] = 1;
        let number = Number(args[0]);

        if (isNaN(number) || number > queue.songs.length || number === 0) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

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
                    .setColor(process.env.COLOR1)
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
                    .setColor(process.env.COLOR1)
                    .setDescription(`⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`)
                ]
            });

        };

    }
};