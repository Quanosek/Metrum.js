/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../bot/config.js').config();
const msgAutoDelete = require('../functions/msgAutoDelete.js')

const Database = require('@replit/database')
const db = new Database()


/* <--- Event ---> */

module.exports = {
    name: 'messageCreate',

    async execute(client, msg) {

        if (!msg.guild) return;

        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;

        /* <--- change prefix ---> */

        let customPrefix = await db.get(`prefix_${msg.guild.id}`)

        if (customPrefix) { prefix = customPrefix } else { prefix = config.prefix };

        /* <--- on mention reply ---> */

        const mentionRegex = new RegExp(`^<@!?(${client.user.id})>( |)$`, 'gi');

        if (msg.content.match(mentionRegex)) {

            msg.react('✅');
            msgAutoDelete(msg, 20);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color1)
                    .setThumbnail(config.icon)
                    .setTitle(`Mój prefix to : \`${prefix}\``)
                    .setDescription(`
Jestem **${config.name}**, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i autoodtwarzania i dużo więcej.

Aby zobaczyć listę wszystkich dostępnych komend wpisz \`${prefix}help\` lub odwiedź moją [stronę internetową](${config.website})!
          `)
                ]
            }).then(msg => msgAutoDelete(msg, 20));
        };

        /* <--- command-build ---> */

        msg.content = msg.content.toLowerCase();

        if (!msg.content.startsWith(prefix) ||
            msg.author.bot ||
            msg.channel.type === 'dm'
        ) return;

        const args = msg.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        /* <--- no-permission ---> */

        if (!msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) {

            msg.react('❌');

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription(`
**Nie mam uprawnień** do zarządzania wiadomościami na tym kanale! Skontaktuj się z administracją serwera.
          `)
                ]
            });

        };

        /* <--- command-run ---> */

        command.run(client, msg, args, prefix)
            .catch(err => {

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(config.color_err)
                        .setDescription(`${err}`)
                    ]
                }).then(msg => msgAutoDelete(msg, 20));

            });

    }
};