/* <--- Import ---> */

require('dotenv').config();
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'odtwarzanie muzyki (obsługuje: wyszukiwanie haseł, oraz linki YouTube, Spotify, SoundCloud)',

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (msg.guild.afkChannel && uservoice.id === msg.guild.afkChannel.id) {
            msg.react('❌');
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
                msg.react('❌');
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
            msg.react('❌');
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

        if (!(uservoice.permissionsFor(msg.guild.me).has('VIEW_CHANNEL') ||
                uservoice.permissionsFor(msg.guild.me).has('CONNECT'))) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`)
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!(uservoice.permissionsFor(msg.guild.me).has('SPEAK'))) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`)
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

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

        return client.distube.play(uservoice, args.join(/ +/), {
            msg,
            textChannel: msg.channel,
            member: msg.member,
        })

    }
};