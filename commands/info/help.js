/** IMPORT */

require('dotenv').config();
const { NAME, ICON, WEBSITE, INVITE, OPINION, DONATE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** HELP COMMAND */

module.exports = {
    name: 'help',
    aliases: ['h'],
    description: 'Wiadomość informacyjna',

    async run(client, prefix, msg, args) {

        /** WITH ARGUMENTS */

        if (args[0]) command = args[0].toLowerCase()

        if (command) {
            const cmd = client.commands.find(x => x.name.includes(command) || x.aliases.includes(command));

            if (!cmd) {
                msg.react('❌'), autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Nie znaleziono podanej komendy!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            msg.react('✅'), autoDelete(msg, 20);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setTitle(`❓ | Opis komendy \`${cmd.name}\`:`)
                    .setDescription(cmd.description)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
            }).then(msg => autoDelete(msg, 20));
        };

        /** WITHOUT ARGUMENTS */

        msg.react('❓'), autoDelete(msg, 45);

        const embed = new MessageEmbed() // main message
            .setColor(COLOR1)
            .setThumbnail(ICON)
            .setTitle(`😄 | Hej, jestem ${NAME}!`)
            .setDescription(`
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **700+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Jeśli chcesz się dowiedzieć o działaniu danej komendy wystarczy, że wpiszesz np. \`${prefix}help play\`, aby przeczytać opis komendy play. Więcej informacji znajdziesz na oficjalnej stronie internetowej.
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
            .addComponents(
                new MessageButton()
                .setStyle('LINK')
                .setURL(DONATE)
                .setLabel(`Wesprzyj twórcę!`)
            )

        return msg.channel.send({ embeds: [embed], components: [buttons] }).then(msg => autoDelete(msg, 45)); // print message

    },
};