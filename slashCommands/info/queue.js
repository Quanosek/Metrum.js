/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** QUEUE SLASH COMMAND */

module.exports = {
    name: 'queue',
    description: 'Informacje o kolejce utworów',

    async run(client, msgInt) {

        /** DEFINE */

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** BIG MESSAGE */

        const embed = new MessageEmbed() // create embed message
            .setColor(COLOR1)
            .setTitle('**💿 | Kolejka utworów:**')
            .setDescription(queue.songs.map(
                    (song, id) =>
                    `**${id + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                )
                .slice(0, 30)
                .join('\n')
            )

        if (queue.songs.length < 2) embed.setFooter({ text: `Aby dowiedzieć się więcej o tym utworze użyj komendy: nowplaying` });
        else embed.setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` });

        // translation

        const rest = queue.songs.length % 10;

        if (queue.songs.length === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        // message content

        if (queue.songs.length > 30) {
            embed.addField('Łącznie w kolejce:', `**${queue.songs.length} ${songs}!**`, true);
        };

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

        // print big message

        return msgInt.reply({ embeds: [embed] });

    },
};