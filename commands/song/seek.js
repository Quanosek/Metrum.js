/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'seek',
  aliases: ['sk'],
  category: 'song',
  description: 'przewinięcie utworu do podanego czasu (w sekundach)',

  async run(client, msg, args, prefix) {

    /* <--- errors ---> */

    const queue = client.distube.getQueue(msg);
    const botvoice = msg.guild.me.voice.channel;
    const uservoice = msg.member.voice.channel;

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

    if (!uservoice || botvoice != uservoice) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz być na kanale głosowym razem ze mną!')
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

    const song = queue.songs[0];

    if (song.isLive) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Nie można przewijać transmisji na żywo!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (!args[0]) args[0] = 0;
    const number = Number(args[0])

    if (!args[0]) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz jeszcze wpisać, do której sekundy chcesz przewinąć utwór!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (isNaN(number) || number > queue.songs[0].duration || number === 0) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Wprowadź poprawną wartość (w sekundach)!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');

    client.distube.seek(msg, number);

    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color1)
        .setDescription(`⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\``)
      ]
    });

  }
};