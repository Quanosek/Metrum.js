/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const axios = require('axios');
const { MessageEmbed } = require('discord.js');

/** LYRICS SLASH COMMAND */

module.exports = {
    name: 'lyrics',
    description: 'Wyświetlenie tekstu dla obecnie odtwarzanego, lub podanego utworu',

    options: [{
        name: 'title',
        description: 'Podaj tytuł utworu, który chcesz wyszukać',
        type: 'STRING',
    }],

    async run(client, msgInt) {

        /** DEFINE */

        let title = msgInt.options.getString('title');
        const queue = client.distube.getQueue(msgInt);

        /** ERROR */

        if (!title) {

            if (!queue) {

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Obecnie **nie jest odtwarzamy żaden utwór**, ani **nie został podany żaden tytuł**!')
                    ],
                    ephemeral: true,
                });
            };

            title = queue.songs[0].name; // default value
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

        const url = new URL('https://some-random-api.ml/lyrics');
        url.searchParams.append('title', title);
        // console.log(url.href); // check final link

        /** COMMAND */

        try {

            const { data } = await axios.get(url.href);
            const embeds = substring(4096, data.lyrics).map((value, index) => {
                const isFirst = index === 0;

                return new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle(isFirst ? `${data.name} - ${data.author}` : '')
                    .setURL(isFirst ? `${data.links.genius}` : '')
                    .setThumbnail(isFirst ? `${data.thumbnail.genius}` : '')
                    .setDescription(value)
            });

            return msgInt.reply({ embeds });

        } catch (err) { // no song error

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Niestety nie znaleziono tekstu dla tego utworu!')
                ],
                ephemeral: true,
            });
        };

    },
};