/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'move',
  aliases: ['mv'],
  category: 'moderation',
  description: 'przesunięcie wybranej pozycji w kolejce utworów',

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

    // numberOne

    if (!args[0]) args[0] = 0;
    let numberOne = Number(args[0]);

    if (!args[0]) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz jeszcze wpisać numer, który utwór z kolejki chcesz przesunąć!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (isNaN(numberOne) || numberOne > queue.songs.length || numberOne < 1) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Wprowadź poprawną wartość (number utworu)!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (numberOne === 1) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Nie można przesunąć obecnie granego utwóru! Wpisz wartość większą od 1.')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    // numberOne

    if (!args[1]) args[1] = 0;
    let numberTwo = Number(args[1]);

    if (!args[1]) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz jeszcze wpisać pozycję w kolejce, na którą chcesz przesunąć wybrany utwór!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (isNaN(numberTwo) || numberTwo > queue.songs.length || numberTwo < 1) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Wprowadź poprawną wartość (pozycja po przesunięciu)!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (numberTwo === 1) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Nie można przesunąć przed obecnie grany utwór! Wpisz wartość większą od 1.')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (numberOne === numberTwo) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Pozycja po przesunięciu nie może być taka sama jak obecna pozycja utowru w kolejce!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');

    numberOne = numberOne - 1;
    let song = queue.songs[numberOne]

    msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color2)
        .setTitle('💿 | Zmodyfikowano kolejność kolejki:')
        .setDescription(`
( **${numberOne + 1}. ==> ${numberTwo}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\`
          `)
      ]
    });

    queue.songs.splice(numberOne, 1)
    return queue.addToQueue(song, numberTwo - 1)

  }
};