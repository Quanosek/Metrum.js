/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FILTER SLASH COMMAND */

module.exports = {
    name: 'filter',
    description: 'Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru, wyłączy go)',

    options: [{
        name: 'choice',
        description: 'Wybierz filtr',
        type: 'STRING',
        required: true,
        choices: [
            { name: 'disable', value: 'disable' },
            { name: '3d', value: '3d' },
            { name: 'bassboost', value: 'bassboost' },
            { name: 'earwax', value: 'earwax' },
            { name: 'echo', value: 'echo' },
            { name: 'flanger', value: 'flanger' },
            { name: 'gate', value: 'gate' },
            { name: 'haas', value: 'haas' },
            { name: 'karaoke', value: 'karaoke' },
            { name: 'mcompand', value: 'mcompand' },
            { name: 'nightcore', value: 'nightcore' },
            { name: 'phaser', value: 'phaser' },
            { name: 'reverse', value: 'reverse' },
            { name: 'surround', value: 'surround' },
            { name: 'tremolo', value: 'tremolo' },
            { name: 'vaporwave', value: 'vaporwave' },
        ],
    }],

    async run(client, msgInt) {

        /** DEFINE */

        const choice = msgInt.options.getString('choice');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        /** choices */

        if (choice === 'disable') {
            client.distube.setFilter(msgInt, false); // execute command

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🪄 | **Wyłączono** wszystkie filtry.')
                ],
            });
        };

        const filter = client.distube.setFilter(msgInt, choice); // execute command

        if (filter.length === 0) {

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🪄 | Żaden filtr **nie jest aktywny**.')
                ],
            });
        };

        /** default message */

        const enabled = filter.join('\`, \`');

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🪄 | **Włączone filtry**: ' + `\`${enabled}\``)
            ],
        });

    },
};