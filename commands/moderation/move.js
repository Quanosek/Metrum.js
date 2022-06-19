/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** MOVE COMMAND */

module.exports = {
    name: 'move',
    aliases: ['mv'],
    description: 'Przesunięcie wybranej pozycji w kolejce utworów',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        let before = Number(args[0]);
        let after = Number(args[1]);

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

        // before

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

        if (isNaN(before) || before > queue.songs.length || before < 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawny number utworu!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (before === 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przesunąć obecnie granego utworu!\nWpisz wartość większą od \`1\`')
                ],
            }).then(msg => autoDelete(msg));
        };

        // after

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

        if (isNaN(after) || after > queue.songs.length || after < 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną pozycję po przesunięciu!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (after === 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przesunąć przed obecnie grany utwór!\nWpisz wartość większą od \`1\`')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (before === after) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        before = before - 1;
        const song = queue.songs[before];

        msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setTitle('💿 | Zmieniono kolejność kolejki:')
                .setDescription(`( **${before + 1}. ==> ${after}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            ],
        });

        queue.songs.splice(before, 1);
        return queue.addToQueue(song, after - 1);

    },
};