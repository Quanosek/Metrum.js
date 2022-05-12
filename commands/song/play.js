/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PLAY COMMAND */

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Odtwarzanie muzyki (podaj tytuł utworu lub link Youtube, Spotify albo SoundCloud!)',

    async run(client, prefix, msg, args) {

        const song = args.join(' ');

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        if (!uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (msg.guild.afkChannel && uservoice.id === msg.guild.afkChannel.id) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Jesteś na kanale AFK!`)
                ],
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
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                }).then(msg => autoDelete(msg));
            };
        };

        if (!song) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Musisz jeszcze wpisać **nazwę** utworu, albo link do: **YouTube**, **Spotify** lub **SoundCloud**!`)
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!(uservoice.permissionsFor(msg.guild.me).has('VIEW_CHANNEL') || uservoice.permissionsFor(msg.guild.me).has('CONNECT'))) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`)
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!(uservoice.permissionsFor(msg.guild.me).has('SPEAK'))) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`)
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        if (!(
                song.includes('youtu.be/') ||
                song.includes('youtube.com/') ||
                song.includes('open.spotify.com/') ||
                song.includes('soundcloud.com/')
            )) {

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔍 | Szukam: \`${song}\`, może to chwilę zająć...`)
                ],
            });
        };

        /** execute command */

        return client.distube.play(uservoice, song, {
            msg,
            textChannel: msg.channel,
            member: msg.member,
        });

    },
};