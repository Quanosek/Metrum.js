/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

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

** ● Dostępne komendy po ukośniku:** (${client.slashCommands.size})
Pełne wytłumaczenie wszystkich dostępnych komend znajdziesz na mojej [stronie internetowej](${WEBSITE})!

** - Utwór:** (4)
\`pause\`, \`play\`, \`resume\`, \`skip\`

** - Kolejka:** (1)
\`radio\`

** - Informacje:** (7)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`prefix\`, \`queue\`, \`search\`

** - Moderacja:** (8)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`remove\`

** ● Zaproszenie:**
Jeśli spodobało ci się moje działanie i funkcje jakie oferuję, możesz zaprosić mnie na swój własny serwer korzystając z [tego linku](${INVITE})!
            `)
            .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })

        /** buttons */

        let buttons = new MessageActionRow();

        buttons
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

        return msgInt.reply({ embeds: [embed], components: [buttons] })
            .then(autoDelete(msgInt, 60)); // print message

    },
};