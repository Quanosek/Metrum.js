/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** REPEAT SLASH COMMAND */

module.exports = {
    name: 'repeat',
    description: 'Przełączanie trybów zapętlenia: utworu/kolejki/wyłączone',

    options: [{
        name: 'mode',
        description: 'Wybierz tryb działania zapętlenia',
        type: 'NUMBER',
        choices: [
            { name: 'song', value: 1 },
            { name: 'queue', value: 2 },
            { name: 'disable', value: 0 }
        ],
    }],

    async run(client, msgInt) {

        /** DEFINE */

        if (msgInt.type === 'APPLICATION_COMMAND') choice = msgInt.options.getNumber('mode');

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        let mode = client.distube.setRepeatMode(msgInt);

        // execute command

        if (msgInt.type === 'APPLICATION_COMMAND') { // slash command

            if (!choice) {
                mode = mode ? mode === 2 ? '🔁 | Włączono zapętlanie **kolejki**.' : '🔂 | Włączono zapętlanie **utworu**.' : '🔁 | **Wyłączono** zapętlanie.';

            } else {
                queue.repeatMode = choice;
                if (choice === 0) mode = '🔁 | **Wyłączono** zapętlanie.';
                if (choice === 1) mode = '🔂 | Włączono zapętlanie **utworu**.';
                if (choice === 2) mode = '🔁 | Włączono zapętlanie **kolejki**.';
            };

        } else { // button interaction

            mode = mode ? mode === 2 ? `🔁 | ${msgInt.member.user} włączył(a) zapętlanie **kolejki**.` : `🔂 | ${msgInt.member.user} włączył(a) zapętlanie **utworu**.` : `🔁 | ${msgInt.member.user} **wyłączył(a)** zapętlanie.`;
        };

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(mode)
            ],
        });

    },
};