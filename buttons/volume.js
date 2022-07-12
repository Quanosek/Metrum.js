/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** VOLUME COMMAND BUTTON */

module.exports = {
    name: 'volume',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, interaction, params) {

        /** DEFINE */

        const name = params[0];

        const queue = client.distube.getQueue(interaction);
        const botvoice = interaction.guild.me.voice.channel;
        const uservoice = interaction.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) // print error embed
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // buttons values

        let value = client.distube.getQueue(interaction).volume

        if (name === 'more') value = value + 5;
        if (name === 'less') value = value - 5;

        if (name === 'normal') {

            if (value === 50) {
                return interaction.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription(`🔈 | Głośność bota **jest już ustawiona** na \`100%\``)
                    ],
                    ephemeral: true,
                });

            } else {
                value = 50;
            };
        };

        client.distube.setVolume(interaction, value); // execute command

        // print button message

        interaction.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`🔈 | ${interaction.user} zmienił **poziom głośności bota** na: \`${value*2}%\``)
            ],
        });

    },
};