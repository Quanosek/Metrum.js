/* <--- Import ---> */

require('dotenv').config();
const prefix = process.env.PREFIX;
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;
const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../functions/msgAutoDelete.js')

// const Database = require('@replit/database')
// const db = new Database()


module.exports = {
    name: 'messageCreate',

    async execute(client, msg) {

        if (!msg.guild) return;

        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;

        const mentionRegex = new RegExp(`^<@!?(${client.user.id})>( |)$`, 'gi');

        if (msg.content.match(mentionRegex)) {

            msg.react('✅');
            msgAutoDelete(msg, 20);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color1)
                    .setThumbnail(process.env.ICON)
                    .setTitle(`Mój prefix to : \`${prefix}\``)
                    .setDescription(`
Jestem Metrum, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i autoodtwarzania i dużo więcej.

Aby zobaczyć listę wszystkich dostępnych komend wpisz \`${prefix}help\` lub odwiedź moją [stronę internetową](${process.env.WEBSITE})!
          `)
                ]
            }).then(msg => msgAutoDelete(msg, 20));
        };


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


        if (!msg.channel.permissionsFor(msg.guild.me).has('MANAGE_MESSAGES')) {

            msg.react('❌');

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription(`
**Nie mam uprawnień** do zarządzania wiadomościami na tym kanale! Skontaktuj się z administracją serwera.
          `)
                ]
            });

        };


        command.run(client, msg, args)
            .catch(err => {

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(color_err)
                        .setDescription(`${err}`)
                    ]
                }).then(msg => msgAutoDelete(msg, 20));

            });

    }
};