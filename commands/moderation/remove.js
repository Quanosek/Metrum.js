/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'remove',
  aliases: ['rm', 'rv'],
  category: 'moderation',
  description: 'usunięcie wybranej pozycji z kolejki utworów',

  async run(client, msg, args, prefix) {

    /* <--- moderation ---> */

    if (
      !msg.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES) ||
      !msg.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)
    ) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

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
    
    if (!args[0]) args[0] = 0;
    let number = Number(args[0]);

    if (!args[0]) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz jeszcze wpisać numer, który utwór z koleji chcesz usunąć!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (isNaN(number) || number > queue.songs.length || number < 1) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Wprowadź poprawną wartość!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');

    // number === 1

    if (number === 1) {

      if (queue.songs.length < 2) {
        if (queue.autoplay) { client.distube.skip(msg) }
        else { client.distube.stop(msg) };
      } else { client.distube.skip(msg) };

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color2)
          .setDescription('🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki.')
        ]
      });
      
    } else {

      // number > 1

      number = number - 1;
      let song = queue.songs[number]

      msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color2)
                 .setTitle('🗑️ | Usunięto z kolejki utworów pozycję:')
          .setDescription(`
**${number + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\`
          `)
        ]
      });

      return queue.songs.splice(number, 1)
      
    };
    
  }
};