/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { Permissions, MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'clear',
    aliases: ['cl', 'c'],
    description: 'wyczyszczenie kolejki (łącznie z obecnie granym utworem)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        if (botvoice && (!uservoice || botvoice != uservoice)) {
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

        client.distube.stop(msg)

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color2)
                .setDescription('🧹 | Wyczyszczono kolejkę bota.')
            ]
        });

    }
};