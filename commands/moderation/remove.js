/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR2 } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** REMOVE COMMAND */

module.exports = {
    name: 'remove',
    aliases: ['rm', 'rv'],
    description: 'usunięcie wybranej pozycji z kolejki utworów',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** OTHER ERRORS */

        if (!args[0]) args[0] = 0; // queue number
        let number = Number(args[0]);

        if (!args[0]) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz jeszcze wpisać numer, który utwór z kolejki chcesz usunąć!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (isNaN(number) || number > queue.songs.length || number < 1) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Wprowadź poprawną wartość!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        // curretly playing

        if (number === 1) { // skipping song

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msg)
                else client.distube.stop(msg);
            } else client.distube.skip(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
                ],
            });

        } else {

            // number > 1

            number = number - 1;
            let song = queue.songs[number];

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
                    .setDescription(`**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``)
                ],
            });

            return queue.songs.splice(number, 1); // execute command
        };

    },
};