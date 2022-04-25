/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SEEK COMMAND */

module.exports = {
    name: 'seek',
    aliases: ['sk'],
    description: 'przewinięcie utworu do podanego czasu (w sekundach)',

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMN ERRORS */

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

        if (!args[0]) args[0] = 0; // seek seconds
        const number = Number(args[0]);

        if (!args[0]) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz jeszcze wpisać, **do której sekundy** chcesz przewinąć utwór!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(number) || number > queue.songs[0].duration || number === 0) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość *(w sekundach)*!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        client.distube.seek(msg, number); // execute command

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\``)
            ],
        });

    },
};