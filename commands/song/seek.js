/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'seek',
    aliases: ['sk'],
    description: 'przewinięcie utworu do podanego czasu (w sekundach)',

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        const song = queue.songs[0];

        if (song.isLive) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie można przewijać transmisji na żywo!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!args[0]) args[0] = 0;
        const number = Number(args[0])

        if (!args[0]) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz jeszcze wpisać, do której sekundy chcesz przewinąć utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(number) || number > queue.songs[0].duration || number === 0) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość (w sekundach)!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        client.distube.seek(msg, number);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color1)
                .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\``)
            ]
        });

    }
};