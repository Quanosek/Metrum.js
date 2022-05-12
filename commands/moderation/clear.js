/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** CLEAR COMMAND */

module.exports = {
    name: 'clear',
    aliases: ['c'],
    description: 'Wyczyszczenie całej kolejki (łącznie z obecnie granym utworem)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (botvoice && (!uservoice || botvoice != uservoice)) {
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

        client.distube.stop(msg); // execute command

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🧹 | Wyczyszczono kolejkę bota.')
            ],
        });

    },
};