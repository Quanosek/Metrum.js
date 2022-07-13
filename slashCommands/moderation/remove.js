/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** REMOVE SLASH COMMAND */

module.exports = {
    name: 'remove',
    description: 'Usunięcie wybranej pozycji z kolejki utworów (domyślnie: obecnie grany)',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'number',
        description: 'Podaj numer utworu w kolejce (domyślnie: obecnie grany)',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        /** DEFINE */

        let number = msgInt.options.getNumber('number');
        if (!number) number = 1; // default value

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
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');
        else if (isNaN(number) || number > queue.songs.length || number < 1)
            errorEmbed.setDescription('Wprowadź **poprawną** wartość!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        if (number === 1) { // currently playing

            // execute command

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msgInt);
                else client.distube.stop(msgInt);
            } else client.distube.skip(msgInt);

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
                ],
            });

        } else { // song number > 1

            number = number - 1;
            const song = queue.songs[number]; // chosen song

            queue.songs.splice(number, 1); // execute command

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
                    .setDescription(`**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                ],
            });
        };

    },
};