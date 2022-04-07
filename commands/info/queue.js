/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'queue',
  aliases: ['q'],
  category: 'info',
  description: 'informacje o kolejce utworów',

  async run(client, msg, args, prefix) {

    /* <--- errors ---> */

    const queue = client.distube.getQueue(msg);
    const botvoice = msg.guild.me.voice.channel;

    if (!botvoice) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Nie jestem na żadnym kanale głosowym!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (!queue) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');

    const embed = new MessageEmbed()
      .setColor(config.color1)
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
        .setFooter(`${prefix}nowplaying wyświetla więcej szczegółów`)
        .setTimestamp()
    };

    if (queue.songs.length > 1) {
      embed
        .setFooter(`Łącza długość kolejki - ${queue.formattedDuration}`)
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