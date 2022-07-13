/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** MOVE SLASH COMMAND */

module.exports = {
    name: 'move',
    description: 'Przesunięcie wybranej pozycji w kolejce utworów',
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

        /** DEFINE */

        let before = msgInt.options.getNumber('before');
        let after = msgInt.options.getNumber('after');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue) {
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');
        } else {
            if (isNaN(before) || before > queue.songs.length || before < 1)
                errorEmbed.setDescription('Wprowadź poprawny number utworu!');
            else if (before === 1)
                errorEmbed.setDescription('Nie można przesunąć obecnie granego utworu!\nWpisz wartość większą od \`1\`');

            else if (isNaN(after) || after > queue.songs.length || after < 1)
                errorEmbed.setDescription('Wprowadź poprawną pozycję po przesunięciu!');
            else if (after === 1)
                errorEmbed.setDescription('Nie można przesunąć przed obecnie grany utwór!\nWpisz wartość większą od \`1\`');

            else if (before === after)
                errorEmbed.setDescription('Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!');
        };

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        before = before - 1;
        const song = queue.songs[before]; // chosen song

        // execute command

        queue.songs.splice(before, 1);
        queue.addToQueue(song, after - 1);

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setTitle('💿 | Zmieniono kolejność kolejki:')
                .setDescription(`( **${before + 1}. ==> ${after}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            ],
        });

    },
};