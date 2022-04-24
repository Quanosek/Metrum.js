/** IMPORT */

require('dotenv').config();
const { NAME, PREFIX, AUTHOR, COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');
const schema = require('../../schemas/guilds.js');

/** COMMAND */

module.exports = {
    name: 'prefix',
    aliases: ['px'],
    description: 'Zmiana prefixu bota.',
    permissions: ['ADMINISTRATOR'],

    async run(client, prefix, msg, args) {

        const db = await schema.findOne({ guildId: msg.guild.id }); // database

        /** change command */

        if (args[0] === 'set') {

            const newPrefix = args[1];

            /** errors */

            if (!newPrefix) {
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('⚙️ | Musisz jeszcze wpisać nowy prefix!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (newPrefix.length > 8) {
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('⚙️ | Wybrany prefix jest zbyt długi *(max. 8 znaków)*!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            if (args[2]) {
                autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('⚙️ | W prefixie nie może być spacji!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            /** command */

            autoDelete(msg, 15);

            db.prefix = newPrefix;
            await db.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⚙️ | Ustawiono nowy prefix: \`${newPrefix}\``)
                ],
            }).then(msg => autoDelete(msg, 15));
        };

        /** reset command */

        if (args[0] === 'reset' || args[0] === 'r') {
            autoDelete(msg, 15);

            db.prefix = PREFIX;
            await db.save();

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⚙️ | Przywrócono domyślny prefix: \`${PREFIX}\``)
                ],
            }).then(msg => autoDelete(msg, 15));
        };

        /** help menu */

        autoDelete(msg, 45);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`⚙️ | Menu zmiany prefixu`)
                .setDescription(`
Komenda pozwala na zmianę prefixu tylko dla tego serwera, w razie zapomnienia prefixu zawsze można wspomnieć bota, tzn. wpisać @${NAME}.

** ● Komendy:**
\`${prefix}prefix set <prefix>\` - ustawia nowy prefix
\`${prefix}prefix reset\` - przywraca domyślny prefix (\`${PREFIX}\`)

** ● Informacje dodatkowe:**
Wszystkie komendy obsługują również skróty np. zamiast pisać \`${prefix}prefix\`, równie dobrze możesz wpisać: \`${prefix}px\` itp..
                `)
                .setFooter({ text: `Autor: ${AUTHOR}` })
                .setTimestamp()
            ],
        }).then(msg => autoDelete(msg, 45));

    },
};