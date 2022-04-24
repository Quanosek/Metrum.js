/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'move',
    aliases: ['mv'],
    description: 'przesunięcie wybranej pozycji w kolejce utworów',
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

        // numberOne

        if (!args[0]) args[0] = 0;
        let numberOne = Number(args[0]);

        if (!args[0]) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz jeszcze wpisać numer, który utwór z kolejki chcesz przesunąć!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(numberOne) || numberOne > queue.songs.length || numberOne < 1) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość (number utworu)!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (numberOne === 1) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie można przesunąć obecnie granego utwóru! Wpisz wartość większą od 1.')
                ]
            }).then(msg => autoDelete(msg));
        };

        // numberOne

        if (!args[1]) args[1] = 0;
        let numberTwo = Number(args[1]);

        if (!args[1]) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz jeszcze wpisać pozycję w kolejce, na którą chcesz przesunąć wybrany utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(numberTwo) || numberTwo > queue.songs.length || numberTwo < 1) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Wprowadź poprawną wartość (pozycja po przesunięciu)!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (numberTwo === 1) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie można przesunąć przed obecnie grany utwór! Wpisz wartość większą od 1.')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (numberOne === numberTwo) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Pozycja po przesunięciu nie może być taka sama jak obecna pozycja utowru w kolejce!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        numberOne = numberOne - 1;
        let song = queue.songs[numberOne]

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color2)
                .setTitle('💿 | Zmodyfikowano kolejność kolejki:')
                .setDescription(`
( **${numberOne + 1}. ==> ${numberTwo}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\`
          `)
            ]
        });

        queue.songs.splice(numberOne, 1)
        return queue.addToQueue(song, numberTwo - 1)

    }
};