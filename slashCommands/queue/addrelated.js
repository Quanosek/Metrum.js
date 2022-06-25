/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** ADD RELATED SLASH COMMAND */

module.exports = {
    name: 'addrelated',
    description: 'Dodanie podobnego do obecnie granego utworu na koniec kolejki',

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
                ephemeral: true,
            });
        };

        if (!uservoice || botvoice != uservoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
                ephemeral: true,
            });
        };

        if (!queue) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        const song = queue.songs[0];
        client.distube.addRelatedSong(queue) // execute command

        const relatedSong = song.related.find((song, id) => id === 0);

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setThumbnail(relatedSong.thumbnail)
                .setTitle('➕ | Dodano do kolejki podobny utwór do obecnie odtwarzanego:')
                .setDescription(`**${queue.songs.length+1}.** [${relatedSong.name}](${relatedSong.url}) - \`${relatedSong.formattedDuration}\``)
            ],
        });

    },
};