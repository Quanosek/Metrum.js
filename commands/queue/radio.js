/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** RADIO COMMAND */

module.exports = {
    name: 'radio',
    aliases: ['r'],
    description: 'Auto-odtwarzanie podobnych utworów (radio utworu)',

    async run(client, prefix, msg, args) {

        let choice;
        if (args[0] === 'enable' || args[0] === 'e') choice = 1;
        if (args[0] === 'disable' || args[0] === 'd') choice = 0;

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');
        let mode = client.distube.toggleAutoplay(msg);

        if (isNaN(choice)) {
            mode = mode ? '**Włączono**' : '**Wyłączono**';

        } else {
            queue.autoplay = choice;
            if (choice === 0) mode = '**Wyłączono**';
            if (choice === 1) mode = '**Włączono**';
        };

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('📻 | ' + mode + ' auto-odtwarzanie (radio utworu).')
            ],
        });

    },
};