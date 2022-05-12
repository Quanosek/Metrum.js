/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FORCE PLAY COMMAND */

module.exports = {
    name: 'forceplay',
    aliases: ['fp'],
    description: 'Wymuszenie puszczenia podanego utworu',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {
        try {

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

            if (uservoice.id === msg.guild.afkChannel.id) {
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
                skip: true,
            });

        } catch (err) {
            console.error(err);
        };
    },
};