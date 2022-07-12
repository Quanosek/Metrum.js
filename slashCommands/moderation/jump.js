/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** JUMP SLASH COMMAND */

module.exports = {
    name: 'jump',
    description: 'Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)',
    permissions: ['MANAGE_MESSAGES'],

    options: [{
        name: 'number',
        description: 'Podaj liczbę, ile utworów chcesz pominąć',
        type: 'NUMBER',
    }],

    async run(client, msgInt) {

        /** DEFINE */

        let number = msgInt.options.getNumber('number');
        if (!number) number = 1; // default value

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
        else if (isNaN(number) || number > queue.songs.length || number === 0)
            errorEmbed.setDescription('Wprowadź poprawną wartość!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // execute command

        if (queue.songs.length <= 2) {
            if (queue.autoplay === true) client.distube.skip(msgInt)
            else client.distube.stop(msgInt);
        } else client.distube.jump(msgInt, number);

        // translation

        const abs = Math.abs(number);
        const rest = number % 10;

        if (abs === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        // message description

        if (number > 0) text = `⏭️ | Pominięto **${number}** ${songs}.`;
        else text = `⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`;

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text)
            ],
        });

    },
};