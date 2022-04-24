/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const axios = require('axios');
const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'lyrics',
    aliases: ['ly', 'text', 't'],
    description: 'wyświetlenie tekstu do odtwarzanego utworu',

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

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

        try {

            const { data } = await axios.get(url.href);
            const embeds = substring(4096, data.lyrics).map((value, index) => {
                const isFirst = index === 0;

                return new MessageEmbed()
                    .setColor(color1)
                    .setTitle(isFirst ? `${data.title} - ${data.author}` : '')
                    .setURL(isFirst ? `${data.links.genius}` : '')
                    .setThumbnail(isFirst ? `${data.thumbnail.genius}` : '')
                    .setDescription(value)
            });

            msg.react('✅');
            return msg.channel.send({ embeds })

        } catch (err) {

            /* <--- command error ---> */

            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie znaleziono tekstu dla tego utworu!')
                ]
            }).then(msg => autoDelete(msg));
        }

    }
};