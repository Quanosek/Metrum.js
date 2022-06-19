/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** CLEAR SLASH COMMAND */

module.exports = {
    name: 'remove',
    description: 'usunięcie wybranej pozycji z kolejki utworów',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'number',
        description: 'Podaj numer utworu w kolejce (domyślnie obecnie grany)',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        let number = msgInt.options.getNumber('number');

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

        /** OTHER ERROR */

        if (!number) number = 1; // default remove number

        if (number > queue.songs.length || number < 1) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        // currently playing

        if (!number || number === 1) { // skipping song

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msgInt);
                else client.distube.stop(msgInt);
            } else client.distube.skip(msgInt);

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
                ],
            });

        } else {

            // number > 1

            number = number - 1;
            const song = queue.songs[number];

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
                    .setDescription(`**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                ],
            });

            return queue.songs.splice(number, 1); // execute command
        };

    },
};