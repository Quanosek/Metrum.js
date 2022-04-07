/* <--- Import ---> */

const { Permissions, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'forceleave',
  aliases: ['fl', 'leave', 'l', 'disconnect'],
  category: 'moderation',
  description: 'wymuszenie wyjścia z kanału głosowego',

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

    const botvoice = msg.guild.me.voice.channel
    const uservoice = msg.member.voice.channel

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

    /* <--- command ---> */

    msg.react('✅');
    msgAutoDelete(msg);

    const connection = getVoiceConnection(msg.guild.id)
    connection.destroy();

    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color_err)
        .setDescription('🚪 | Wyszedłem z kanału głosowego!')
      ]
    }).then(msg => msgAutoDelete(msg));

  }
};