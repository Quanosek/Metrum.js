/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { Permissions, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'forceleave',
    aliases: ['fl', 'leave', 'disconnect', 'dc'],
    description: 'wymuszenie wyjścia z kanału głosowego',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        if (!botvoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        autoDelete(msg);

        client.distube.voices.get(msg).leave();

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(color2)
                .setDescription('🚪 | Wyszedłem z kanału głosowego!')
            ]
        }).then(msg => autoDelete(msg));

    }
};