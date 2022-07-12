/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** JUMP COMMAND */

module.exports = {
    name: 'jump',
    aliases: ['j'],
    description: 'Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /** DEFINE */

        let number = Number(args[0]);
        if (!args[0]) number = 1; // default value

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
        else if (isNaN(number) || number > queue.songs.length || number === 0)
            errorEmbed.setDescription('Wprowadź poprawną wartość!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        // execute command

        msg.react('✅');

        if (queue.songs.length <= 2) {
            if (queue.autoplay === true) client.distube.skip(msg)
            else client.distube.stop(msg);
        } else client.distube.jump(msg, number);

        // translation

        const abs = Math.abs(number);
        const rest = number % 10;

        if (abs === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        // message description

        if (number > 0) text = `⏭️ | Pominięto **${number}** ${songs}.`;
        else text = `⏮️ | Cofnięto się o **${abs}** ${songs}.`;

        // print command message

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(text)
            ],
        });

    },
};