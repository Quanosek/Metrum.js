/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, OPINION, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** HELP SLASH COMMAND */

module.exports = {
    name: 'help',
    description: 'Wiadomość informacyjna',

    options: [{
        name: 'command',
        description: 'Podaj nazwę komendy, o której chcesz się dowiedzieć więcej',
        type: 'STRING',
    }],

    async run(client, msgInt) {

        const command = msgInt.options.getString('command').toLowerCase();

        if (command) {
            const cmd = client.slashCommands.find(x => x.name.includes(command));

            if (!cmd) {

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Nie znaleziono podanej komendy!')
                    ],
                    ephemeral: true,
                });
            };

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle(`❓ | Opis komendy \`${cmd.name}\`:`)
                    .setDescription(cmd.description)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        const embed = new MessageEmbed() // main message
            .setColor(COLOR1)
            .setThumbnail(ICON)
            .setTitle(`😄 | Hej, jestem ${NAME}!`)
            .setDescription(`
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **700+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

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

        return msgInt.reply({ embeds: [embed], components: [buttons] }).then(autoDelete(msgInt, 60)); // print message

    },
};