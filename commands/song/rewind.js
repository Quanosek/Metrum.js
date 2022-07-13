/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const ms = require('ms');
const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** REWIND COMMAND */

module.exports = {
    name: 'rewind',
    aliases: ['rw'],
    description: 'Przewinięcie utworu do tyłu o podaną wartość (domyślnie: 10 sekund)',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        let number = args.join(' ');
        if (!number) number = '10s'; // default value

        if (/[a-z]/.test(number)) number = ms(number) / 1000;
        else number = ms(number);

        const queue = client.distube.getQueue(msg);
        if (queue) song = queue.songs[0]; // now playing song
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

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
            if (isNaN(number) || number === 0)
                errorEmbed.setDescription('Wprowadź **poprawną** wartość (w sekundach)!');
        };

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        // seekTime

        let seekTime = queue.currentTime - number;
        if (seekTime < 0) seekTime = 0;
        else if (seekTime >= song.duration) seekTime = song.duration - 1;

        client.distube.seek(msg, seekTime); // execute command

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

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text + ` (\`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\`).`)
            ],
        });

    },
};