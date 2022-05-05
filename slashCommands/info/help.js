/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR1 } = process.env;

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
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłch lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

** ● Dostępne Komendy:** (${client.commands.size}/${client.slashCommands.size})
Pełne wytłumaczenie wszystkich dostępnych komend znajdziesz na mojej [stronie internetowej](${WEBSITE})!

** - Utwór:** (8)
\`forward\`, \`lyrics\`, \`pause\`, \`play\`, \`resume\`, \`rewind\`, \`seek\`, \`skip\`

** - Kolejka:** (6)
\`addend\`, \`addrelated\`, \`previous\`, \`radio\`, \`repeat\`, \`shuffle\`

** - Informacje:** (6)
\`help\`, \`invite\`, \`nowplaying\`, \`ping\`, \`queue\`, \`search\`

** - Moderacja:** (9)
\`add\`, \`clear\`, \`forceleave\`, \`forceplay\`, \`forceskip\`, \`jump\`, \`move\`, \`prefix\`, \`remove\`

** ● Zaproszenie:**
Jeśli spodobało ci się moje działaie i funkcje jakie oferuję, możesz zaprosić mnie na swój własny serwer korzystając z [tego linku](${INVITE})!
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