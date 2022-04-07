/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'loop',
    aliases: ['lp', 'repeat', 'rp'],
    category: 'queue',
    description: 'przełączanie zapętlenia: utworu/kolejki/wyłączone',

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

        if (!queue) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        let mode = client.distube.setRepeatMode(msg);
        mode = mode ? mode === 2 ? 'Włączono zapętlanie **kolejki**' : 'Włączono zapętlanie **utworu**' : '**Wyłączono** zapętlanie';

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color1)
                .setDescription('🔁 | ' + mode + '.')
            ]
        });

    }
};