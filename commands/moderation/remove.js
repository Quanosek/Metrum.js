/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** REMOVE COMMAND */

module.exports = {
    name: 'remove',
    aliases: ['rm'],
    description: 'Usunięcie wybranej pozycji z kolejki utworów (domyślnie: obecnie grany)',
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
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');
        else if (isNaN(number) || number > queue.songs.length || number < 1)
            errorEmbed.setDescription('Wprowadź **poprawną** wartość!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        if (number === 1) { // currently playing

            // execute command

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msg);
                else client.distube.stop(msg);
            } else client.distube.skip(msg);

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
                ],
            });

        } else { // song number > 1

            number = number - 1;
            const song = queue.songs[number]; // chosen song

            queue.songs.splice(number, 1); // execute command

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
                    .setDescription(`**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                ],
            });

        };

    },
};