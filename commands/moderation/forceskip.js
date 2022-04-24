/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { Permissions, MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    description: 'wymuszenie pominięcia utworu',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        if (!botvoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        if (queue.paused) client.distube.resume(msg);

        if (queue.songs.length < 2) {
            if (queue.autoplay) { client.distube.skip(msg) } else { client.distube.stop(msg) };
        } else { client.distube.skip(msg) };

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color1)
                .setDescription('⏭️ | Pominięto utwór.')
            ]
        });

    }
};