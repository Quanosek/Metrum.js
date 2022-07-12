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

        /** DEFINE */

        let before = Number(args[0]);
        let after = Number(args[1]);

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue) {
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');
        } else {
            if (!args[0])
                errorEmbed.setDescription('Musisz jeszcze wpisać numer, który utwór z kolejki chcesz przesunąć!');
            else if (isNaN(before) || before > queue.songs.length || before < 1)
                errorEmbed.setDescription('Wprowadź poprawny number utworu!');
            else if (before === 1)
                errorEmbed.setDescription('Nie można przesunąć obecnie granego utworu!\nWpisz wartość większą od \`1\`');

            else if (!args[1])
                errorEmbed.setDescription('Musisz jeszcze wpisać pozycję w kolejce, na którą chcesz przesunąć wybrany utwór!');
            else if (isNaN(after) || after > queue.songs.length || after < 1)
                errorEmbed.setDescription('Wprowadź poprawną pozycję po przesunięciu!');
            else if (after === 1)
                errorEmbed.setDescription('Nie można przesunąć przed obecnie grany utwór!\nWpisz wartość większą od \`1\`');

            else if (before === after)
                errorEmbed.setDescription('Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!');
        };

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        before = before - 1;
        const song = queue.songs[before]; // chosen song

        // execute command

        queue.songs.splice(before, 1);
        queue.addToQueue(song, after - 1);

        // print command message

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setTitle('💿 | Zmieniono kolejność kolejki:')
                .setDescription(`( **${before + 1}. ==> ${after}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
            ],
        });

    },
};