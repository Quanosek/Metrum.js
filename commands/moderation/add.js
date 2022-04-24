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
    name: 'add',
    aliases: ['ad', 'a'],
    description: 'dodanie podanego utworu **jako kolejny** w kolejce',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (uservoice.id === msg.guild.afkChannel.id) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription(`Jesteś na kanale AFK!`)
                ]
            }).then(msg => autoDelete(msg));
        };

        if (botvoice) {

            if (botvoice.members.size === 1) {
                client.distube.voices.get(msg).leave();

            } else if (queue && uservoice != botvoice) {
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(color_err)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ]
                }).then(msg => autoDelete(msg));
            };

        };

        const name = args.join(' ');

        if (!name) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription(`
Musisz jeszcze wpisać **nazwę** utworu
albo link do: **YouTube**, **Spotify** lub **SoundCloud**!
          `)
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        if (!(
                msg.content.includes('youtu.be/') ||
                msg.content.includes('youtube.com/') ||
                msg.content.includes('open.spotify.com/') ||
                msg.content.includes('soundcloud.com/')
            )) {

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setDescription(`🔍 | Szukam: \`${name}\`, może to chwilę zająć...`)
                ]
            });

        };

        const options = { unshift: true };

        return client.distube.play(msg, name, options);

    }
};