/* <--- Import ---> */

require('dotenv').config();
const prefix = process.env.PREFIX;
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'informacje o kolejce utworów',

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ]
            }).then(msg => autoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        const embed = new MessageEmbed()
            .setColor(color1)
            .setTitle('**💿 | Kolejka utworów:**')
            .setDescription(queue.songs.map(
                    (song, id) =>
                    `**${id + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
                )
                .slice(0, 30)
                .join('\n')
            );

        if (queue.songs.length < 2) {
            embed
                .setFooter({ text: `${prefix}nowplaying wyświetla więcej szczegółów` })
                .setTimestamp()
        };

        if (queue.songs.length > 1) {
            embed
                .setFooter({ text: `Łącza długość kolejki - ${queue.formattedDuration}` })
                .setTimestamp()
        };

        let songs;
        let rest = queue.songs.length % 10;

        if (queue.songs.length === 1) songs = 'utwór'
        else if (rest < 2 || rest > 4) songs = 'utworów'
        else if (rest > 1 || rest < 5) songs = 'utwory'

        if (queue.songs.length > 30) {
            embed.addField('Łącznie w kolejce:', `**${queue.songs.length} ${songs}!**`, true)
            embed.setTimestamp();
        };

        if (queue.paused || queue.autoplay || queue.repeatMode) {
            params = ''

            if (queue.paused) params += '\`⏸️|pauza\` \n'
            if (queue.repeatMode === 1) params += '\`🔁|zapętlanie utworu\` \n'
            if (queue.repeatMode === 2) params += '\`🔁|zapętlanie kolejki\` \n'
            if (queue.autoplay) params += '\`📻|autoodtwarzanie\` \n'

            embed.addField('Włączone opcje:', params)
        };

        return msg.channel.send({ embeds: [embed] });

    }
};