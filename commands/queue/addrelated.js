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

        /** DEFINE */

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
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');
        client.distube.addRelatedSong(queue) // execute command

        // print command message

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