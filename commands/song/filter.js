/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FILTER COMMAND */

module.exports = {
    name: 'filter',
    aliases: ['f'],
    description: 'Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru, wyłączy go)',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const choice = args[0];
        const modes = [
            'disable',
            '3d',
            'bassboost',
            'earwax',
            'echo',
            'flanger',
            'gate',
            'haas',
            'karaoke',
            'mcompand',
            'nightcore',
            'phaser',
            'reverse',
            'surround',
            'tremolo',
            'vaporwave'
        ];

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        /** no choices (info) */

        if (!choice) {
            msg.react('🪄'), autoDelete(msg);

            let modeText = modes.join('\`, \`');

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle('⚙️ | Menu filtrów:')
                    .setDescription('Możesz ustawić filtr na odtwarzane utwory w danej sesji.\n\n**Dostępne tryby:**\n' + `\`${modeText}\``)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
            }).then(msg => autoDelete(msg, 30));
        };

        /** choices */

        if (modes.includes(choice)) {

            msg.react('✅');

            if (choice === 'disable') {
                client.distube.setFilter(msg, false); // execute command

                // print command message

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR2)
                        .setDescription('🪄 | **Wyłączono** wszystkie filtry.')
                    ],
                });
            };

            const filter = client.distube.setFilter(msg, choice); // execute command

            if (filter.length === 0) {

                // print command message

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR2)
                        .setDescription('🪄 | Żaden filtr **nie jest aktywny**.')
                    ],
                });
            };

            /** default message */

            const enabled = filter.join('\`, \`');

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🪄 | **Włączone filtry**: ' + `\`${enabled}\``)
                ],
            });

        };

    },
};