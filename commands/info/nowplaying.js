/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** NOW PLAYING COMMAND */

module.exports = {
    name: 'nowplaying',
    aliases: ['np', 'info', 'i'],
    description: 'informacje o odtwarzanym utworze',

    async run(client, prefix, msg, args) {

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
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

        /** COMMAND */

        msg.react('✅');

        const song = queue.songs[0]; // that song in queue

        const embed = new MessageEmbed() // create big embed
            .setColor(COLOR1)
            .setTitle('**🎵 | Teraz odtwarzane:**')
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `${prefix}queue wyświetla obecną kolejkę` })
            .setTimestamp()

        embed.addFields({ name: 'Tytuł:', value: `[${song.name}](${song.url})` }, { name: 'Autor:', value: `[${song.uploader.name}](${song.uploader.url})` }, )

        if (song.isLive) {
            embed.addField('Czas trwania:', `\`Live\``)
        } else {
            embed.addField('Czas trwania:', `\`${queue.formattedCurrentTime}\` / \`${song.formattedDuration}\``)
        };

        embed.addFields({ name: 'Wyświetlenia:', value: `\`${song.views}\``, inline: true }, { name: 'Łapki w górę:', value: `\`${song.likes}\``, inline: true }, );

        embed.addField('Dodane przez:', `${song.user}`);

        if (queue.paused || queue.autoplay || queue.repeatMode) {
            params = '';

            if (queue.paused) params += '\`⏸️|pauza\` \n'
            if (queue.repeatMode === 1) params += '\`🔁|zapętlanie utworu\` \n'
            if (queue.repeatMode === 2) params += '\`🔁|zapętlanie kolejki\` \n'
            if (queue.autoplay) params += '\`📻|autoodtwarzanie\` \n'

            embed.addField('Włączone opcje:', params);
        };

        const nextSong = queue.songs[1];

        if (nextSong) embed.addField('Następne w kolejce:', `[${nextSong.name}](${nextSong.url}) - \`${nextSong.formattedDuration}\``);

        return msg.channel.send({ embeds: [embed] }); // print message

    },
};