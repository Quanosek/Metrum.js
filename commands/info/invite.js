/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const settings = require('../../bot/settings.json')
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'invite',
  aliases: ['inv'],
  category: 'info',
  description: 'zaproszenia',

  async run(client, msg, args, prefix) {

    /* <--- command ---> */

    msg.react('✅');
    msgAutoDelete(msg);

    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color1)
        .setTitle('📧 | Zaproś mnie na swój serwer!')
        .setDescription(`
[Metrum](${settings.metrum1.invite}) | [Metrum 2](${settings.metrum2.invite}) | [Metrum 3](${settings.metrum3.invite})
        `)
        .setFooter(`Bot stworzony przez: ${config.author}`)
        .setTimestamp()
      ]
    }).then(msg => msgAutoDelete(msg));

  }
};