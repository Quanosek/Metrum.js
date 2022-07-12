/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const ms = require('ms');
const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SEEK COMMAND */

module.exports = {
    name: 'seek',
    aliases: ['sk'],
    description: 'Przewinięcie granego utworu do podanej wartości',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        let number = args.join(' ');
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
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue) {
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');
        } else {
            if (song.isLive)
                errorEmbed.setDescription('Nie można przewijać transmisji na żywo!');
            if (isNaN(number) || number === 0)
                errorEmbed.setDescription('Wprowadź poprawną wartość (w sekundach)!');
        };

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');
        client.distube.seek(msg, number); // execute command

        // print command message

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\``)
            ],
        });

    },
};