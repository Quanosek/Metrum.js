/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/** NOW PLAYING SLASH COMMAND */

module.exports = {
    name: 'nowplaying',
    description: 'Informacje o odtwarzanym utworze',

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;

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

        const song = queue.songs[0]; // that song in queue

        const embed = new MessageEmbed() // create big embed
            .setColor(COLOR1)
            .setTitle('**🎵 | Teraz odtwarzane:**')
            .setThumbnail(song.thumbnail)

        let timeValue;
        if (song.isLive) timeValue = `\`Live\``
        else timeValue = `\`${queue.formattedCurrentTime}\` / \`${song.formattedDuration}\``

        embed.addFields({
            name: 'Tytuł:',
            value: `[${song.name}](${song.url})`
        }, {
            name: 'Autor:',
            value: `[${song.uploader.name}](${song.uploader.url})`
        }, {
            name: 'Czas trwania:',
            value: timeValue,
        }, {
            name: 'Wyświetlenia:',
            value: `\`${song.views}\``,
            inline: true
        }, {
            name: 'Łapki w górę:',
            value: `\`${song.likes}\``,
            inline: true
        }, {
            name: 'Dodane przez:',
            value: `${song.user}`,
        });

        const filters = queue.filters;

        if (queue.paused ||
            queue.repeatMode ||
            queue.autoplay ||
            filters.length !== 0
        ) {
            let params = '';

            if (queue.paused) params += '\`⏸️|pauza\` \n'
            if (queue.repeatMode === 1) params += '\`🔂|zapętlanie utworu\` \n'
            if (queue.repeatMode === 2) params += '\`🔁|zapętlanie kolejki\` \n'
            if (queue.autoplay) params += '\`📻|auto-odtwarzanie\` \n'
            if (filters.length !== 0) params += '\`🪄|filtry: ' + (filters.join(', ')) + '\` \n'

            embed.addField('Włączone opcje:', params);
        };

        const nextSong = queue.songs[1];
        if (nextSong) embed.addField('Następne w kolejce:', `[${nextSong.name}](${nextSong.url}) - \`${nextSong.formattedDuration}\``);

        const buttons = new MessageActionRow() // buttons
            .addComponents(
                new MessageButton()
                .setCustomId(`nowplaying-pause`)
                .setStyle('SUCCESS')
                .setLabel(`⏸️ | Zatrzymaj`)
            )
            .addComponents(
                new MessageButton()
                .setCustomId(`nowplaying-skip`)
                .setStyle('SUCCESS')
                .setLabel(`⏭️ | Pomiń`)
            )
            .addComponents(
                new MessageButton()
                .setCustomId(`nowplaying-repeat`)
                .setStyle('PRIMARY')
                .setLabel(`🔁 | Zapętlanie`)
            )
            .addComponents(
                new MessageButton()
                .setCustomId(`nowplaying-radio`)
                .setStyle('PRIMARY')
                .setLabel(`📻 | Radio`)
            ).addComponents(
                new MessageButton()
                .setCustomId(`nowplaying-search-${song.name.trim().substring(0, 80)}`)
                .setStyle('SECONDARY')
                .setLabel(`🔎 | Wyszukaj podobne`)
            )

        return msgInt.reply({ embeds: [embed], components: [buttons] }); // print message

    },
};