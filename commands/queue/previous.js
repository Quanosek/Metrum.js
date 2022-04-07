/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'previous',
    aliases: ['pr', 'back', 'b'],
    category: 'queue',
    description: 'odtworzenie poprzednio granego utworu w kolejce',

    async run(client, msg, args, prefix) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!queue || queue.previousSongs.length < 1) {

            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('Nie znaleziono poprzedniego utworu!')
                ]
            }).then(msg => msgAutoDelete(msg));

        };

        /* <--- command ---> */

        msg.react('✅');
        client.distube.previous(msg)

    }
};