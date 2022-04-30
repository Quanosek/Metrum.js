/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PAUSE COMMAND */

module.exports = {
    name: 'lyrics',
    aliases: ['ly'],
    description: 'Wyświetlenie tekstu do odtwarzanego utworu',

    async run(client, prefix, msg, args) {

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

            msg.react('✅');
            return msg.channel.send({ embeds })

        } catch (err) { // no song error

            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie znaleziono tekstu dla tego utworu!')
                ],
            }).then(msg => autoDelete(msg));
        };

    },
};