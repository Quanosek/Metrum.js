/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** ADD COMMAND */

module.exports = {
    name: 'add',
    aliases: ['ad', 'a'],
    description: 'dodanie podanego utworu **jako kolejny** w kolejce',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        if (!uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (uservoice.id === msg.guild.afkChannel.id) {
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
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                }).then(msg => autoDelete(msg));
            };

        };

        const name = args.join(' '); // song/video title

        if (!name) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Musisz jeszcze wpisać **nazwę** utworu, albo link do: **YouTube**, **Spotify** lub **SoundCloud**!`)
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        if (!(
                msg.content.includes('youtu.be/') ||
                msg.content.includes('youtube.com/') ||
                msg.content.includes('open.spotify.com/') ||
                msg.content.includes('soundcloud.com/')
            )) {

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔍 | Szukam: \`${name}\`, może to chwilę zająć...`)
                ],
            });

        };

        const options = { unshift: true };
        return client.distube.play(msg, name, options); // execute command

    },
};