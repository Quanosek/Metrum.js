/*

require('dotenv').config();
const { Permissions, MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');

const Database = require('@replit/database')
const db = new Database()


module.exports = {
    name: 'prefix',
    aliases: ['pref', 'pf', 'px'],
    category: 'admin',
    description: 'zmiana prefixu bota',

    async run(client, msg, args, prefix) {


        if (!msg.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };


        if (args[0] === 'change' || args[0] === 'ch') {

            const newPrefix = args[1]

            // errors

            if (!newPrefix) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(process.env.COLOR_ERR)
                        .setDescription('⚙️ | Musisz jeszcze wpisać nowy prefix!')
                    ]
                }).then(msg => msgAutoDelete(msg));
            };

            if (newPrefix.length > 8) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(process.env.COLOR_ERR)
                        .setDescription('⚙️ | Wybrany prefix jest zbyt długi!')
                    ]
                }).then(msg => msgAutoDelete(msg));
            };

            if (args[2]) {
                msg.react('❌');
                msgAutoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(process.env.COLOR_ERR)
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
                    .setColor(process.env.COLOR1)
                    .setDescription(`⚙️ | Zmieniono prefix na: \`${newPrefix}\``)
                ]
            }).then(msg => msgAutoDelete(msg, 15));
        };


        if (args[0] === 'reset' || args[0] === 'r') {
            msg.react('✅');
            msgAutoDelete(msg, 15);

            if (db.get(`prefix_${msg.guild.id}`)) { await db.delete(`prefix_${msg.guild.id}`) }

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR1)
                    .setDescription(`⚙️ | Przywrócono domyślny prefix: \`${process.env.PREFIX}\``)
                ]
            }).then(msg => msgAutoDelete(msg, 15));
        };


        msg.react('✅');
        msgAutoDelete(msg, 45);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(process.env.COLOR1)
                .setTitle(`⚙️ | Menu zmiany prefixu`)
                .setDescription(`
Komenda pozwala na zmianę prefixu tylko dla tego serwera, w razie zapomnienia prefixu zawsze można wspomnieć bota, tzn. wpisać @Metrum.

** ● Komendy:**
\`${prefix}prefix change <nowy prefix>\` - ustawia nowy prefix
\`${prefix}prefix reset\` - przywraca domyślny prefix (\`${process.env.PREFIX}\`)

** ● Informacje dodatkowe:**
Wszystkie komendy obsługują również skróty np. zamiast pisać \`${process.env.PREFIX}prefix\`, równie dobrze możesz wpisać: \`${process.env.PREFIX}pf\` itp..
          `)
                .setFooter(`Bot stworzony przez: Quanosek`)
                .setTimestamp()
            ]
        }).then(msg => msgAutoDelete(msg, 45));

    }
};

*/