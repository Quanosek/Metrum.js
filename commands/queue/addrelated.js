/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'addrelated',
  aliases: ['ar'],
  category: 'queue',
  description: 'dodanie podobnego do obecnie granego utworu na koniec kolejki',

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

    msg.react('✅');

    queue.addRelatedSong();

    const song = queue.songs[0];
    
    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color1)
               .setTitle('➕ | Dodano do kolejki podobny utwór do:')
        .setDescription(`\`${song.name}\`.`)
        .setFooter(`${prefix}queue wyświetla obecną kolejkę`)
        .setTimestamp()
      ]
    });

  }
};