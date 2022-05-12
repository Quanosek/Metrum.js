/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** MOVE COMMAND */

module.exports = {
    name: 'move',
    aliases: ['mv'],
    description: 'Przesunięcie wybranej pozycji w kolejce utworów',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {
        try {

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

            // WHAT

            if (!args[0]) args[0] = 0;
            let numberOne = Number(args[0]);

            if (!args[0]) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz jeszcze wpisać numer, który utwór z kolejki chcesz przesunąć!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (isNaN(numberOne) || numberOne > queue.songs.length || numberOne < 1) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Wprowadź poprawną wartość (number utworu)!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (numberOne === 1) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Nie można przesunąć obecnie granego utwóru! Wpisz wartość większą od 1.')
                    ],
                }).then(msg => autoDelete(msg));
            };

            // WHERE

            if (!args[1]) args[1] = 0;
            let numberTwo = Number(args[1]);

            if (!args[1]) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz jeszcze wpisać pozycję w kolejce, na którą chcesz przesunąć wybrany utwór!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (isNaN(numberTwo) || numberTwo > queue.songs.length || numberTwo < 1) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Wprowadź poprawną wartość (pozycja po przesunięciu)!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (numberTwo === 1) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Nie można przesunąć przed obecnie grany utwór! Wpisz wartość większą od 1.')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (numberOne === numberTwo) {
                msg.react('❌');
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Pozycja po przesunięciu nie może być taka sama jak obecna pozycja utowru w kolejce!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            /** COMMAND */

            msg.react('✅');

            numberOne = numberOne - 1;
            let song = queue.songs[numberOne];

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle('💿 | Zmodyfikowano kolejność kolejki:')
                    .setDescription(`( **${numberOne + 1}. ==> ${numberTwo}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                ],
            });

            queue.songs.splice(numberOne, 1);
            return queue.addToQueue(song, numberTwo - 1);

        } catch (err) {
            console.error(err);
        };
    },
};