/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, COLOR1, AUTHOR_NAME } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** HELP COMMAND */

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'pomoc',

    async run(client, prefix, msg, args) {

        /** COMMAND */

        msg.react('❓');
        autoDelete(msg, 60);

        return msg.channel.send({
            embeds: [new MessageEmbed() // main message
                .setColor(COLOR1)
                .setThumbnail(ICON)
                .setTitle(`Hej, jestem ${NAME}!`)
                .setDescription(`
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłch lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

** ● Dostępne Komendy:** (${client.commands.size})
Pełne wytłumaczenie wszystkich dostępnych komend znajdziesz na mojej [stronie internetowej](${WEBSITE})!

** - Utwór:** (8)
\`forward\`, \`lyrics\`, \`pause\`, \`play\`, \`resume\`, \`rewind\`, \`seek\`, \`skip\`

** - Kolejka:** (6)
\`addend\`, \`addrelated\`, \`loop\`, \`previous\`, \`radio\`, \`shuffle\`

** - Informacje:** (6)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`queue\`, \`search\`

** - Moderacja:** (9)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`prefix\`, \`remove\`

** ● Zaproszenie:**
Jeśli spodobało ci się moje działaie i funkcje jakie oferuję, możesz zaprosić mnie na swój własny serwer korzystając z [tego linku](${INVITE})!
                `)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME}` })
                .setTimestamp()
            ],
        }).then(msg => autoDelete(msg, 60));

    },
};