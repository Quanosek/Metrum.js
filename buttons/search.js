/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SERACH COMMAND BUTTON */

module.exports = {
    name: 'search',

    async run(client, interaction, params) {

        /** DEFINE */

        const queue = client.distube.getQueue(interaction);
        const botvoice = interaction.guild.me.voice.channel;
        const uservoice = interaction.member.voice.channel;

        const name = params[0];
        const songId = params[1];

        let result = await client.distube.search(name);

        /** ERRORS */

        if (!uservoice) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
                ],
                ephemeral: true,
            });
        };

        if (interaction.guild.afkChannel && uservoice.id === interaction.guild.afkChannel.id) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`Jesteś na kanale AFK!`)
                ],
                ephemeral: true,
            });
        };

        if (botvoice) {

            if (botvoice.members.size === 1) {
                client.distube.voices.get(interaction).leave();

            } else if (queue && uservoice != botvoice) {

                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                    ephemeral: true,
                });
            };

        };

        if (!(uservoice.permissionsFor(interaction.guild.me).has('VIEW_CHANNEL') ||
                uservoice.permissionsFor(interaction.guild.me).has('CONNECT'))) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`**Nie mam dostępu** do kanału głosowego, na którym jesteś!`)
                ],
                ephemeral: true,
            });
        };

        if (!(uservoice.permissionsFor(interaction.guild.me).has('SPEAK'))) {

            return interaction.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`**Nie mam uprawnień** do aktywności głosowej na twoim kanale!`)
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`🎵 | ${msgInt.member.user} wybrał(a) utwór:`)
                .setDescription(`[${result[songId - 1].name}](${result[songId - 1].url}) - \`${result[songId - 1].formattedDuration}\``)
            ],
        });

        return client.distube.play(uservoice, result[songId - 1].url, {
            interaction,
            textChannel: interaction.channel,
            member: interaction.member,
        });

    },
};