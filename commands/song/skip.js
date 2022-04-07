/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

let skipVotes = [];

module.exports = {
  name: 'skip',
  aliases: ['s'],
  category: 'song',
  description: 'pominięcie utworu (głosowanie)',

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

    /* <--- voting system ---> */

    // define

    let users = uservoice.members.size;

    uservoice.members.forEach(member => {
      if (member.user.bot) {
        users = users - 1;
      };
    });

    const required = Math.ceil(users / 2);

    // errors

    if (skipVotes.some((x) => x === msg.author.id)) {
      msg.react('❌');
      msgAutoDelete(msg, 5);

      return msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color_err)
          .setDescription(`🗳️ | Już zagłosowałeś/aś!`)
        ]
      }).then(msg => msgAutoDelete(msg, 5));
    };

    // command

    skipVotes.push(msg.author.id);
    process.setMaxListeners(Infinity);

    if (required > 1) {
      msg.react('✅');

      let votes;
      let rest = required % 10;

      if (rest > 1 || rest < 5) votes = 'głosy'
      else if (rest < 2 || rest > 4) votes = 'głosów'

      msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color2)
          .setDescription(`🗳️ | Głosujesz za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`)
        ]
      });
    };

    /* <--- command ---> */

    if (skipVotes.length >= required) {

      msg.react('✅');

      if (queue.paused) client.distube.resume(msg);

      if (queue.songs.length < 2) {
        if (queue.autoplay) { client.distube.skip(msg) }
        else { client.distube.stop(msg) };
      } else { client.distube.skip(msg) };

      msg.channel.send({
        embeds: [new MessageEmbed()
          .setColor(config.color1)
          .setDescription('⏭️ | Pominięto utwór.')
        ]
      });

      return skipVotes = [];

    };

    /* <--- events ---> */

    client.distube.on('playSong', (queue, song) => {
      return skipVotes = [];
    });

  }
};