/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const ms = require('ms');
const { MessageEmbed } = require('discord.js');

/** SEEK SLASH COMMAND */

module.exports = {
    name: 'seek',
    description: 'Przewinięcie granego utworu do podanej wartości',

    options: [{
        name: 'value',
        description: 'Podaj wartość, do którego momentu chcesz przewinąć utwór',
        type: 'STRING',
        required: true,
    }],

    async run(client, msgInt) {

        /** DEFINE */

        let number = ms(msgInt.options.getNumber('value'));
        if (/[a-z]/.test(number)) number = ms(number) / 1000;
        else number = ms(number);

        const queue = client.distube.getQueue(msgInt);
        if (queue) song = queue.songs[0]; // now playing song
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue) {
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');
        } else {
            if (song.isLive)
                errorEmbed.setDescription('Nie można przewijać transmisji na żywo!');
            if (isNaN(number) || number > queue.songs[0].duration || number < 0)
                errorEmbed.setDescription('Wprowadzono niepoprawną wartość!');
        };

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        client.distube.seek(msgInt, number); // execute command

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\``)
            ],
        });

    },
};