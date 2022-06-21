/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, OPINION, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** HELP SLASH COMMAND */

module.exports = {
    name: 'help',
    description: 'Wiadomość informacyjna',

    async run(client, msgInt) {

        /** COMMAND */

        const embed = new MessageEmbed() // main message
            .setColor(COLOR1)
            .setThumbnail(ICON)
            .setTitle(`Hej, jestem ${NAME}!`)
            .setDescription(`
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

** ● Lista dostępnych komend po ukośniku:** (${client.slashCommands.size})

** - Utwór:** (8)
\`forward\`, \`lyrics\`, \`pause\`, \`play\`, \`resume\`, \`rewind\`, \`seek\`, \`skip\`

** - Kolejka:** (6)
\`addend\`, \`addrelated\`, \`previous\`, \`radio\`, \`repeat\`, \`shuffle\`

** - Informacje:** (7)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`prefix\`, \`queue\`, \`search\`

** - Moderacja:** (8)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`remove\`

** ● Więcej:**
Aby dowiedzieć się o dokładnym działaniu komend odwiedź [stronę internetową](${WEBSITE}), możesz także mnie [zaprosić](${INVITE}) na swój własny serwer lub [zostawić opinię](${OPINION})!
            `)
            .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })

        const buttons = new MessageActionRow() // buttons
            .addComponents(
                new MessageButton()
                .setStyle('LINK')
                .setURL(WEBSITE)
                .setLabel(`Wbijaj na stronę!`)
            )
            .addComponents(
                new MessageButton()
                .setStyle('LINK')
                .setURL(INVITE)
                .setLabel(`Zaproś mnie na serwer!`)
            )
            .addComponents(
                new MessageButton()
                .setStyle('LINK')
                .setURL(OPINION)
                .setLabel(`Zostaw opinię!`)
            )

        return msgInt.reply({ embeds: [embed], components: [buttons] })
            .then(autoDelete(msgInt, 60)); // print message

    },
};