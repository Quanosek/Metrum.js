/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js')


/* <--- Command ---> */

module.exports = {
  name: 'statsfromallservers',
  aliases: ['sfas'],
  category: 'dev',
  description: 'test',

  async run(client, msg, args, prefix) {

    /* <--- dev only ---> */

    const msgAuthor = msg.author.username + '#' + msg.author.discriminator;

    if (!(msgAuthor === config.author)) {
      msg.react('❌');
      msgAutoDelete(msg);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
        ]
      }).then(msg => msgAutoDelete(msg));
    };

    /* <--- command ---> */

    msg.react('✅');
    msgAutoDelete(msg, 1);

    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color1)
        .setTitle(`**Lista wszystkich serwerów, na których jestem:**`)
        .setDescription(client.guilds.cache.map(
          (guild, number) =>
            ` ● **${guild}**, ${number}`
        )
          .join('\n')
        )
      ]
    }).then(msg => msgAutoDelete(msg, 30));

  }
};