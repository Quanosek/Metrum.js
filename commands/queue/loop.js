/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'loop',
    aliases: ['l', 'repeat', 'rp'],
    description: 'przełączanie zapętlenia: utworu/kolejki/wyłączone',

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

        msg.react('✅');

        let mode = client.distube.setRepeatMode(msg);
        mode = mode ? mode === 2 ? 'Włączono zapętlanie **kolejki**' : 'Włączono zapętlanie **utworu**' : '**Wyłączono** zapętlanie';

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color1)
                .setDescription('🔁 | ' + mode + '.')
            ]
        });

    }
};