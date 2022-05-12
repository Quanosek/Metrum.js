/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FORCE SKIP COMMAND */

module.exports = {
    name: 'forceskip',
    aliases: ['fs'],
    description: 'Wymuszenie pominięcia utworu',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {
        try {

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

            /** COMMAND */

            msg.react('✅');

            if (queue.paused) client.distube.resume(msg);

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msg)
                else client.distube.stop(msg);
            } else client.distube.skip(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('⏭️ | Pominięto utwór.')
                ],
            });

        } catch (err) {
            console.error(err);
        };
    },
};