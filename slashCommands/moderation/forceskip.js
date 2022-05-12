/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FORCE SLASH COMMAND */

module.exports = {
    name: 'forceskip',
    description: 'Wymuszenie pominięcia utworu',
    permissions: ['MANAGE_MESSAGES'],

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

        /** COMMAND */

        if (queue.paused) client.distube.resume(msgInt);

        if (queue.songs.length < 2) {
            if (queue.autoplay) client.distube.skip(msgInt);
            else client.distube.stop(msgInt);
        } else client.distube.skip(msgInt);

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('⏭️ | Pominięto utwór.')
            ],
        });

    },
};