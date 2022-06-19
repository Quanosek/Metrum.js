/** IMPORT */

require('dotenv').config();
const { PREFIX, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1 } = process.env;

require('colors');

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../functions/autoDelete.js');
const schema = require('../schemas/guilds.js');

/** MESSAGE CREATE EVENT */

module.exports = {
    name: 'messageCreate',

    async run(client, msg) {

        if (!msg.channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES')) return; // if no permissions to send

        /** manage database */

        let db = await schema.findOne({ guildId: msg.guild.id });
        if (!db) db = await schema.create({

            guildId: msg.guild.id,
            prefix: PREFIX,

        });

        let prefix = db.prefix; // custom prefix

        /** reply on mention */

        const mentionRegex = new RegExp(`^<@!?(${client.user.id})>( |)$`, 'gi');

        if (msg.content.match(mentionRegex)) {

            autoDelete(msg);

            return msg.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle(`😄 | Hej, to ja!`)
                    .setDescription(`
Jestem zaawansowanym polskim botem muzycznym, obsługującym **YouTube**, **Spotify** oraz **SoundCloud**. Posiadam takie funkcje jak kolejki, radio, pauza, przewijanie i wiele więcej!

Mój prefix to \`${prefix}\`
Użyj komendy \`help\` po więcej informacji!
                    `)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
            }).then(msg => autoDelete(msg));
        };

        /** avoid simple mistakes */

        if (!msg.content.toLowerCase().startsWith(prefix) ||
            !msg.guild ||
            msg.author.bot ||
            msg.channel.type === 'dm'
        ) return;

        const [cmdName, ...args] = msg.content.slice(prefix.length).trim().split(' ');

        /** find command or aliases */

        const cmd = client.commands.get(cmdName.toLowerCase()) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName.toLowerCase()));

        /** error */

        if (!cmd) return; // no command
        if (!msg.member.permissions.has(cmd.permissions || [])) { // no permissions

            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** finish */

        try {
            await cmd.run(client, prefix, msg, args); // run command

        } catch (err) {
            if (err) {

                console.error(` >>> ${err}`.brightRed);
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('🛑 | Pojawił się błąd podczas uruchamiania komendy!')
                    ],
                }).then(msg => autoDelete(msg));
            };
        };

    },
};