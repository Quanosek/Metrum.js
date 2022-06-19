/** IMPORT */

require('dotenv').config();
const { PREFIX, ICON, WEBSITE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR1 } = process.env;

require('colors');

const { MessageEmbed } = require('discord.js');

const realDate = require('../functions/realDate.js');
const schema = require('../schemas/guilds.js');

/** GUILD CREATE EVENT */

module.exports = {
    name: 'guildCreate',

    async run(client, guild) {

        await schema.create({ // create db
            guildName: guild.name,
            guildId: guild.id,
            prefix: PREFIX,
        });

        console.log(realDate() + ` Guild: ${guild.name}, ID: ${guild.id}`.grey + `\n >>> Bot ` + `joined`.brightGreen + ` to the server!`); // log

        /** welcome message */

        let channelToSend;

        guild.channels.cache.forEach(channel => {
            if (
                channel.type === 'GUILD_TEXT' &&
                channel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
            ) channelToSend = channel;
        });

        if (channelToSend) {

            try {

                return channelToSend.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR1)
                        .setThumbnail(ICON)
                        .setTitle('😄 | Cieszę się, że tu jestem!')
                        .setDescription(`
Dziękuję za dodanie mnie na serwer!!! Jestem Metrum, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i auto-odtwarzania i dużo więcej.

Moim domyślnym prefixem jest: \`${PREFIX}\`

Aby dowiedzieć się więcej użyj komendy \`help\` lub odwiedź moją [stronę internetową](${WEBSITE})!
                        `)
                        .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                    ],
                });

            } catch (err) {
                if (err) console.error(` >>> ${err}`.brightRed);
            };

        };
    },
};