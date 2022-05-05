/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH } = process.env;

const { MessageEmbed } = require('discord.js');

/** QUEUE SLASH COMMAND */

module.exports = {
    name: 'queue',
    description: 'Informacje o kolejce utworów',

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
            });
        };

        if (!queue) {

            return msgInt.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            });
        };

        /** COMMAND */

        const embed = new MessageEmbed() // create big embed
            .setColor(COLOR1)
            .setTitle('**💿 | Kolejka utworów:**')
            .setDescription(queue.songs.map(
                    (song, id) =>
                    `**${id + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                )
                .slice(0, 30)
                .join('\n')
            )
            .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })

        let songs;
        let rest = queue.songs.length % 10;

        if (queue.songs.length === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        if (queue.songs.length > 30) {
            embed.addField('Łącznie w kolejce:', `**${queue.songs.length} ${songs}!**`, true);
        };

        if (queue.paused || queue.autoplay || queue.repeatMode) {
            let params = '';

            if (queue.paused) params += '\`⏸️|pauza\` \n'
            if (queue.repeatMode === 1) params += '\`🔁|zapętlanie utworu\` \n'
            if (queue.repeatMode === 2) params += '\`🔁|zapętlanie kolejki\` \n'
            if (queue.autoplay) params += '\`📻|autoodtwarzanie\` \n'

            embed.addField('Włączone opcje:', params);
        };

        return msgInt.reply({ embeds: [embed] }); // print message

    },
};