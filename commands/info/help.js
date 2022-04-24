/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, COLOR1, AUTHOR_NAME } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** HELP COMMAND */

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'pomoc',

    async run(client, prefix, msg, args) {

        /** COMMAND */

        msg.react('✅');
        autoDelete(msg, 60);

        return msg.channel.send({
            embeds: [new MessageEmbed() // main message
                .setColor(COLOR1)
                .setThumbnail(ICON)
                .setTitle(`Hej, jestem ${NAME}!`)
                .setDescription(`
Zaawansowany, darmowy bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist, auto odtwarzania, zapętlania i dużo dużo więcej!

** ● Dostępne Komendy:** (28)
Pełne wytłumaczenie wszystkich komend znajduje się na stronie internetowej (link poniżej)!

** - Utwór:** (7)
\`forward\`, \`pause\`, \`play\`, \`resume\`, \`rewind\`, \`seek\`, \`skip\`

** - Kolejka:** (6)
\`addend\`, \`addrelated\`, \`loop\`, \`previous\`, \`radio\`, \`shuffle\`

** - Informacje:** (6)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`queue\`, \`search\`

** - Moderacja:** (9)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`prefix\`, \`remove\`

** ● Linki:**
--->> [strona internetowa](${WEBSITE}) <<---
--->> [zaproś mnie](${INVITE}) <<---
                `)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME}` })
                .setTimestamp()
            ],
        }).then(msg => autoDelete(msg, 60));

    },
};