/* <--- Import ---> */

const { Permissions, MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js');

const Database = require('@replit/database')
const db = new Database()


/* <--- Command ---> */

module.exports = {
    name: 'prefix',
    aliases: ['pref', 'pf', 'px'],
    category: 'admin',
    description: 'zmiana prefixu bota',

    async run(client, msg, args, prefix) {

        /* <--- admin ---> */

        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- change ---> */

        if (args[0] === 'change' || args[0] === 'ch') {

            const newPrefix = args[1]

            // errors

            if (!newPrefix) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(config.color_err)
                        .setDescription('⚙️ | Musisz jeszcze wpisać nowy prefix!')
                    ]
                }).then(msg => msgAutoDelete(msg));
            };

            if (newPrefix.length > 8) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(config.color_err)
                        .setDescription('⚙️ | Wybrany prefix jest zbyt długi!')
                    ]
                }).then(msg => msgAutoDelete(msg));
            };

            if (args[2]) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(config.color_err)
                        .setDescription('⚙️ | W prefixie nie może być spacji!')
                    ]
                }).then(msg => msgAutoDelete(msg));
            }

            // command

            msg.react('✅');
            msgAutoDelete(msg, 15);

            await db.set(`prefix_${msg.guild.id}`, newPrefix);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color1)
                    .setDescription(`⚙️ | Zmieniono prefix na: \`${newPrefix}\``)
                ]
            }).then(msg => msgAutoDelete(msg, 15));
        };

        /* <--- reset ---> */

        if (args[0] === 'reset' || args[0] === 'r') {
            msg.react('✅');
            msgAutoDelete(msg, 15);

            if (db.get(`prefix_${msg.guild.id}`)) { await db.delete(`prefix_${msg.guild.id}`) }

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color1)
                    .setDescription(`⚙️ | Przywrócono domyślny prefix: \`${config.prefix}\``)
                ]
            }).then(msg => msgAutoDelete(msg, 15));
        };

        /* <--- help ---> */

        msg.react('✅');
        msgAutoDelete(msg, 45);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(config.color1)
                .setTitle(`⚙️ | Menu zmiany prefixu`)
                .setDescription(`
Komenda pozwala na zmianę prefixu tylko dla tego serwera, w razie zapomnienia prefixu zawsze można wspomnieć bota, tzn. wpisać @${config.name}.

** ● Komendy:**
\`${prefix}prefix change <nowy prefix>\` - ustawia nowy prefix
\`${prefix}prefix reset\` - przywraca domyślny prefix (\`${config.prefix}\`)

** ● Informacje dodatkowe:**
Wszystkie komendy obsługują również skróty np. zamiast pisać \`${config.prefix}prefix\`, równie dobrze możesz wpisać: \`${config.prefix}pf\` itp..
          `)
                .setFooter(`Bot stworzony przez: ${config.author}`)
                .setTimestamp()
            ]
        }).then(msg => msgAutoDelete(msg, 45));

    }
};