/* <--- Import ---> */

require('dotenv').config();
const clr = require('colors');
const { MessageEmbed } = require('discord.js');

const realDate = require('../functions/realDate.js')


/* <--- Event ---> */

module.exports = {
    name: 'guildCreate',

    async execute(client, guild) {

        /* <--- create log ---> */

        console.log(`> ` + clr.brightCyan(`[${realDate()}]`) + ` Guild: ${guild.name}, ${guild.id}\n>> Bot ` + clr.brightGreen(`joined`) + ` to the server!`);

        /* <--- welcome message ---> */

        let channelToSend;

        guild.channels.cache.forEach(channel => {
            if (
                channel.type === 'GUILD_TEXT' &&
                channel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'VIEW_CHANNEL'])
            ) channelToSend = channel;
        });

        if (channelToSend) {

            return channelToSend.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR1)
                    .setThumbnail(process.env.ICON)
                    .setTitle('😄 | Cieszę się, że tu jestem!')
                    .setDescription(`
Dziękuję za dodanie mnie na serwer!!! Jestem Metrum, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i autoodtwarzania i dużo więcej.

Moim domyślnym prefixem jest: \`${process.env.PREFIX}\`

Aby zobaczyć listę wszystkich dostępnych komend wpisz \`${process.env.PREFIX}help\` lub odwiedź moją [stronę internetową](${process.env.WEBSITE})!
        `)
                    .setTimestamp()
                ]
            }).catch(err => {
                console.error(`> ` + clr.brightCyan(`[${realDate()}]`) + ` On guildCreate: ` + clr.Red(`Failed to create welcome-message (code ${err.code})`) + `.`);
            });

        };

    }
};