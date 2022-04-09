/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { Permissions, MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'clear',
    aliases: ['cl', 'c'],
    category: 'moderation',
    description: 'wyczyszczenie kolejki (łącznie z obecnie granym utworem)',

    async run(client, msg, args) {

        /* <--- moderation ---> */

        if (!msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
            !msg.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
        ) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        if (botvoice && (!uservoice || botvoice != uservoice)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        client.distube.stop(msg)

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color2)
                .setDescription('🧹 | Wyczyszczono kolejkę bota.')
            ]
        });

    }
};