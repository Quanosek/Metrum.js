/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** NOW PLAYING COMMAND */

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Informacje o odtwarzanym utworze',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const queue = client.distube.getQueue(msg);
        if (queue) song = queue.songs[0]; // that song in queue
        const botvoice = msg.guild.me.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** BIG MESSAGE */

        msg.react('✅');

        const embed = new MessageEmbed() // create big embed
            .setColor(COLOR1)
            .setTitle('**🎵 | Teraz odtwarzane:**')
            .setThumbnail(song.thumbnail)

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

        // enabled options menu

        const filters = queue.filters;

        if (
            queue.paused ||
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

        // next song informations

        const nextSong = queue.songs[1];
        if (nextSong) embed.addField('Następne w kolejce:', `[${nextSong.name}](${nextSong.url}) - \`${nextSong.formattedDuration}\``);

        /** buttons */

        const buttons = new MessageActionRow()
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

        /** print big message */

        return msg.channel.send({ embeds: [embed], components: [buttons] }); // print message

    },
};