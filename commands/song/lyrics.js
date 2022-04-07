/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'lyrics',
  aliases: ['ly', 'text', 't'],
  category: 'song',
  description: 'wyświetlenie tekstu do odtwarzanego utworu',

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

    /* <--- command ---> */

    function substring(length, value) {
      const replaced = value.replace(/\n/g, '--');
      const regex = `.{1,${length}}`;
      const lines = replaced
        .match(new RegExp(regex, 'g'))
        .map(line => line.replace(/--/g, '\n'));

      return lines;
    };

    const songTitle = queue.songs[0].name;

    const url = new URL('https://some-random-api.ml/lyrics');
    url.searchParams.append('title', songTitle)

    try {

      const { data } = await axios.get(url.href);
      const embeds = substring(4096, data.lyrics).map((value, index) => {
        const isFirst = index === 0;

        return new MessageEmbed()
          .setColor(config.color1)
          .setTitle(isFirst ? `${data.title} - ${data.author}` : '')
          .setURL(isFirst ? `${data.links.genius}` : '')
          .setThumbnail(isFirst ? `${data.thumbnail.genius}` : '')
          .setDescription(value)
      });

      msg.react('✅');
      return msg.channel.send({ embeds })

    } catch (err) {

      /* <--- command error ---> */

      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Nie znaleziono tekstu dla tego utworu!')
        ]
      }).then(msg => msgAutoDelete(msg));
    }

  }
};