require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../functions/msgAutoDelete.js')

// const Database = require('@replit/database')
// const db = new Database()


module.exports = {
    name: 'messageCreate',

    async execute(client, msg) {

        if (!msg.guild) return;

        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return;

        // let customPrefix = await db.get(`prefix_${msg.guild.id}`)
        // if (customPrefix) { prefix = customPrefix } else { prefix = process.env.PREFIX };

        let prefix = process.env.PREFIX;

        const mentionRegex = new RegExp(`^<@!?(${client.user.id})>( |)$`, 'gi');

        if (msg.content.match(mentionRegex)) {

            msg.react('✅');
            msgAutoDelete(msg, 20);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR1)
                    .setThumbnail(process.env.ICON)
                    .setTitle(`Mój prefix to : \`${prefix}\``)
                    .setDescription(`
Jestem **${config.name}**, czyli najlepszy bezpłatny bot muzyczny, oferujący odtwarzanie linków z **YouTube**, **Spotify** i **SoundCloud** w najlepszej jakości z obsługą szukania, kolejek, transmisji na żywo, playlist i autoodtwarzania i dużo więcej.

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
                    .setColor(process.env.COLOR_ERR)
                    .setDescription(`
**Nie mam uprawnień** do zarządzania wiadomościami na tym kanale! Skontaktuj się z administracją serwera.
          `)
                ]
            });

        };


        command.run(client, msg, args, prefix)
            .catch(err => {

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(process.env.COLOR_ERR)
                        .setDescription(`${err}`)
                    ]
                }).then(msg => msgAutoDelete(msg, 20));

            });

    }
};