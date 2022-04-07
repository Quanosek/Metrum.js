/* <--- Import ---> */

const { Permissions, MessageEmbed } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'forceplay',
  aliases: ['fp'],
  category: 'moderation',
  description: 'wymuszenie puszczenia podanego utworu',

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

    if (!uservoice) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('Musisz najpierw dołączyć na kanał głosowy!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (uservoice.id === msg.guild.afkChannel.id) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription(`Jesteś na kanale AFK!`)
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    if (botvoice) {

      if (botvoice.members.size === 1) {
        const connection = getVoiceConnection(msg.guild.id)
        connection.destroy();

      } else if (queue && uservoice != botvoice) {
        msg.react('❌');
        msgAutoDelete(msg);

        return msg.channel.send({
          embeds: [new MessageEmbed()
            .setColor(config.color_err)
            .setDescription('Musisz być na kanale głosowym razem ze mną!')
          ]
        }).then(msg => msgAutoDelete(msg));
      };

    };
    const name = args.join(' ');

    if (!name) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription(`
Musisz jeszcze wpisać **nazwę** utworu
albo link do: **YouTube**, **Spotify** lub **SoundCloud**!
          `)
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');

    if (!(
      msg.content.includes('youtu.be/') ||
      msg.content.includes('youtube.com/') ||
      msg.content.includes('open.spotify.com/') ||
      msg.content.includes('soundcloud.com/')
    )) {

      msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color1)
          .setDescription(`🔍 | Szukam: \`${name}\`, może to chwilę zająć...`)
        ]
      });

    };

    const options = { skip: true };

    return client.distube.play(msg, name, options);

  }
};