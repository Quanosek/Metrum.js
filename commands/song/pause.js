/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'pause',
    aliases: ['ps'],
    category: 'song',
    description: 'wstrzymanie/wznowienie odtwarzania utworu',

    async run(client, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
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

        // playing

        if (queue.playing) {
            msg.react('✅');

            client.distube.pause(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription('⏸️ | Wstrzymano odtwarzanie.')
                ]
            });
        };

        // paused

        if (queue.paused) {
            msg.react('✅');

            client.distube.resume(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription('▶️ | Wznowiono odtwarzanie.')
                ]
            });
        };

    }
};