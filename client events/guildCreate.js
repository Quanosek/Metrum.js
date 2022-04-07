/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');
const clr = require('colors');

const config = require('../bot/config.js').config();
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
                    .setColor(config.color1)
                    .setThumbnail(config.icon)
                    .setTitle('😄 | Cieszę się, że tu jestem!')
                    .setDescription(`
Dziękuję za dodanie mnie na serwer!!! Jestem **${config.name}**, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i autoodtwarzania i dużo więcej.

Moim domyślnym prefixem jest: \`${config.prefix}\`

Aby zobaczyć listę wszystkich dostępnych komend wpisz \`${config.prefix}help\` lub odwiedź moją [stronę internetową](${config.website})!
        `)
                    .setTimestamp()
                ]
            }).catch(err => {
                console.error(`> ` + clr.brightCyan(`[${realDate()}]`) + ` On guildCreate: ` + clr.Red(`Failed to create welcome-message (code ${err.code})`) + `.`);
            });

        };

    }
};