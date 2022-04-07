/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
  name: 'help',
  aliases: ['h'],
  category: 'info',
  description: 'pomoc',

  async run(client, msg, args, prefix) {

    /* <--- command ---> */

    msg.react('✅');
    msgAutoDelete(msg, 60);

    return msg.channel.send({
      embeds: [new MessageEmbed()
        .setColor(config.color1)
        .setThumbnail(config.icon)
        .setTitle(`Hej, jestem ${config.name}!`)
        .setDescription(`
Zaawansowany, darmowy bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist, auto odtwarzania, zapętlania i dużo dużo więcej!

** ● Dostępne Komendy:** (31)
Pełne wytłumaczenie wszystkich komend znajduje się na stronie internetowej (link poniżej)!

** - Utwór:** (8)
\`forward\`, \`lyrics\`, \`pause\`, \`play\`, \`resume\`, \`rewind\`, \`seek\`, \`skip\`

** - Kolejka:** (6)
\`addend\`, \`addrelated\`, \`loop\`, \`previous\`, \`radio\`, \`shuffle\`

** - Informacje:** (6)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`queue\`, \`search\`

** - Moderacja (DJ):** (8)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`remove\`

** - Administracja:** (3)
\`prefix\`, \`reload\`, \`stop\`

** ● Linki:**
--->> [strona internetowa](${config.website}) <<---
--->> [moje zaproszenie](${config.invite}) <<---
        `)
        .setFooter(`Bot stworzony przez: ${config.author}`)
        .setTimestamp()
      ]
    }).then(msg => msgAutoDelete(msg, 60));

  }
};