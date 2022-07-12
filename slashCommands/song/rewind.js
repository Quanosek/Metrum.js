/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const ms = require('ms');
const { MessageEmbed } = require('discord.js');

/** REWIND SLASH COMMAND */

module.exports = {
    name: 'rewind',
    description: 'Przewinięcie utworu do tyłu o podaną wartość (domyślnie: 10 sekund)',

    options: [{
        name: 'value',
        description: 'Podaj wartość, o ile chcesz przewinąć utwór do tyłu',
        type: 'STRING',
    }],

    async run(client, msgInt) {

        /** DEFINE */

        let number = ms(msgInt.options.getNumber('value'));
        if (!number) number = '10s'; // default value

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
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue) {
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');
        } else {
            if (song.isLive)
                errorEmbed.setDescription('Nie można przewijać transmisji na żywo!');
            if (isNaN(number) || number === 0)
                errorEmbed.setDescription('Wprowadzono niepoprawną wartość!');
        };

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // seekTime

        let seekTime = queue.currentTime - number;
        if (seekTime < 0) seekTime = 0;
        else if (seekTime >= song.duration) seekTime = song.duration - 1;

        client.distube.seek(msgInt, seekTime); // execute command

        // translation

        const abs = Math.abs(number);
        const rest = number % 10;

        if (abs === 1) seconds = 'sekundę'
        else if (rest < 2 || rest > 4) seconds = 'sekund'
        else if (rest > 1 || rest < 5) seconds = 'sekundy'

        // message description

        if (number > 0) text = `⏪ | Przewinięto utwór o \`${number}\` ${seconds} **do tyłu**`;
        else text = `⏩ | Przewinięto utwór o \`${abs}\` ${seconds} **do przodu**`;

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text + ` (\`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\`).`)
            ],
        });

    },
};