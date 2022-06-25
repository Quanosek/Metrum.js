/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** ADD RELATED COMMAND */

module.exports = {
    name: 'addrelated',
    aliases: ['ar'],
    description: 'Dodanie podobnego do obecnie granego utworu na koniec kolejki',

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        const song = queue.songs[0];
        client.distube.addRelatedSong(queue) // execute command

        const relatedSong = song.related.find((song, id) => id === 0);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setThumbnail(relatedSong.thumbnail)
                .setTitle('➕ | Dodano do kolejki podobny utwór do obecnie odtwarzanego:')
                .setDescription(`**${queue.songs.length+1}.** [${relatedSong.name}](${relatedSong.url}) - \`${relatedSong.formattedDuration}\``)
            ],
        });

    },
};