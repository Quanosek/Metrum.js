/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** ADD SLASH COMMAND */

module.exports = {
    name: 'add',
    description: 'Dodanie podanego utworu jako następny w kolejce',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'song',
        description: 'Podaj tytuł utworu lub link Youtube, Spotify albo SoundCloud',
        type: 'STRING',
        required: true,
    }],

    async run(client, msgInt) {

        const song = msgInt.options.getString('song');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        if (!uservoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ],
                ephemeral: true,
            });
        };

        if (uservoice.id === msgInt.guild.afkChannel.id) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Jesteś na kanale AFK!`)
                ],
                ephemeral: true,
            });
        };

        if (botvoice) {

            if (botvoice.members.size === 1) {
                client.distube.voices.get(msgInt).leave();

            } else if (queue && uservoice != botvoice) {

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                    ephemeral: true,
                });
            };
        };

        if (!song) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Musisz jeszcze wpisać **nazwę** utworu, albo link do: **YouTube**, **Spotify** lub **SoundCloud**!`)
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        if (
            song.includes('youtu.be/') ||
            song.includes('youtube.com/') ||
            song.includes('open.spotify.com/') ||
            song.includes('soundcloud.com/')
        ) {
            msgInt.reply(song);

        } else {

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔍 | Szukam: \`${song}\`, może to chwilę zająć...`)
                ],
            });
        };

        /** execute command */

        return client.distube.play(uservoice, song, {
            msgInt,
            textChannel: msgInt.channel,
            member: msgInt.member,
            position: 1,
        });

    },
};