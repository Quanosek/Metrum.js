/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** CLEAR SLASH COMMAND */

module.exports = {
    name: 'move',
    description: 'przesunięcie wybranej pozycji w kolejce utworów',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
            name: 'before',
            description: 'Podaj numer wybranego utworu w obecnej kolejce',
            type: 'NUMBER',
            required: true,
        },
        {
            name: 'after',
            description: 'Podaj numer, na którą pozycję chcesz przenieść wybrany utwór',
            type: 'NUMBER',
            required: true,
        }
    ],

    async run(client, msgInt) {

        let before = msgInt.options.getNumber('before');
        let after = msgInt.options.getNumber('after');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
                ephemeral: true,
            });
        };

        if (!uservoice || botvoice != uservoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
                ephemeral: true,
            });
        };

        if (!queue) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
                ephemeral: true,
            });
        };

        // before

        if (before > queue.songs.length || before < 1) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawny number utworu!')
                ],
                ephemeral: true,
            });
        };

        if (before === 1) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przesunąć obecnie granego utwóru!\nWpisz wartość większą od \`1\`')
                ],
                ephemeral: true,
            });
        };

        // after

        if (after > queue.songs.length || after < 1) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną pozycję po przesunięciu!')
                ],
                ephemeral: true,
            });
        };

        if (after === 1) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie można przesunąć przed obecnie grany utwór!\nWpisz wartość większą od \`1\`')
                ],
                ephemeral: true,
            });
        };

        if (before === after) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        before = before - 1;
        const song = queue.songs[before];

        msgInt.reply({
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