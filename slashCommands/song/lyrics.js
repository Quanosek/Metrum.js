/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const axios = require('axios');
const { MessageEmbed } = require('discord.js');

/** LYRICS SlASH COMMAND */

module.exports = {
    name: 'lyrics',
    description: 'Wyświetlenie tekstu do odtwarzanego utworu',

    async run(client, msgInt) {

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

        /** CREATING URL ADDRESS */

        function substring(length, value) {
            const replaced = value.replace(/\n/g, '--');
            const regex = `.{1,${length}}`;
            const lines = replaced
                .match(new RegExp(regex, 'g'))
                .map(line => line.replace(/--/g, '\n'));

            return lines;
        };

        const songTitle = queue.songs[0].name;

        const url = new URL('https://some-random-api.ml/lyrics');
        url.searchParams.append('title', songTitle)

        /** COMMAND */

        try {

            const { data } = await axios.get(url.href);
            const embeds = substring(4096, data.lyrics).map((value, index) => {
                const isFirst = index === 0;

                return new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle(isFirst ? `${data.title} - ${data.author}` : '')
                    .setURL(isFirst ? `${data.links.genius}` : '')
                    .setThumbnail(isFirst ? `${data.thumbnail.genius}` : '')
                    .setDescription(value)
            });

            return msgInt.reply({ embeds })

        } catch (err) { // no song error

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie znaleziono tekstu dla tego utworu!')
                ],
                ephemeral: true,
            });
        };

    },
};