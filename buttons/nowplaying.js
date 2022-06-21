/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SERACH COMMAND BUTTON */

module.exports = {
    name: 'nowplaying',

    async run(client, interaction, params) {

        /** DEFINE */

        const queue = client.distube.getQueue(interaction);
        const botvoice = interaction.guild.me.voice.channel;
        const uservoice = interaction.member.voice.channel;

        const name = params[0];
        let requester = interaction.member.user;

        /** COMMON ERRORS */

        if (!botvoice) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
                ephemeral: true,
            });
        };

        if (!uservoice || botvoice != uservoice) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
                ephemeral: true,
            });
        };

        if (!queue) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
                ephemeral: true,
            });
        };

        /** PAUSE BUTTON */

        if (name === 'pause') {

            if (queue.paused) {
                client.distube.resume(interaction);

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`▶️ | ${requester} wznowił(a) odtwarzanie.`)
                    ],
                });

            } else {
                client.distube.pause(interaction);

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`⏸️ | ${requester} wstrzymał(a) odtwarzanie.`)
                    ],
                });
            };

        };

        /** REPEAT SONG BUTTON */

        if (name === 'repeat1') {
            if (queue.repeatMode === 1) {

                queue.repeatMode = 0;

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`🔂 | ${requester} **wyłączył(a)** zapętlanie.`)
                    ],
                });

            } else {
                queue.repeatMode = 1;

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`🔂 | ${requester} włączył(a) zapętlanie **utworu**.`)
                    ],
                });
            };
        };

        /** REPEAT QUEUE BUTTON */

        if (name === 'repeat2') {
            if (queue.repeatMode === 2) {

                queue.repeatMode = 0;

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`🔁 | ${requester} **wyłączył(a)** zapętlanie.`)
                    ],
                });

            } else {
                queue.repeatMode = 2;

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setDescription(`🔁 | ${requester} włączył(a) zapętlanie **kolejki**.`)
                    ],
                });
            };
        };

        /** RADIO BUTTON */

        if (name === 'radio') {
            const mode = client.distube.toggleAutoplay(interaction);

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`📻 | ${requester} ` + (mode ? '**włączył(a)**' : '**wyłączył(a)**') + ' auto-odtwarzanie (radio utworu).')
                ],
            });
        };

    },
};