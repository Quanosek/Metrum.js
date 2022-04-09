/* <--- Import ---> */

require('dotenv').config();

const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js')


/* <--- Command ---> */

module.exports = {
    name: 'allguildsownersmsg',
    aliases: ['agom'],
    category: 'dev',
    description: 'test',

    async run(client, msg, args) {

        /* <--- dev only ---> */

        const msgAuthor = msg.author.username + '#' + msg.author.discriminator;

        if (!(msgAuthor === process.env.AUTHOR)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('🛑 | Nie masz uprawnień do użycia tej komendy!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');
        msgAutoDelete(msg, 1);

        client.guilds.cache.forEach(guild => {

            return client.users.fetch(guild.ownerId).then(dm => {
                dm.send({

                    embeds: [new MessageEmbed()
                        .setColor(process.env.COLOR1)
                        .setTitle(`Tytuł!`)
                        .setDescription(`
Wiadomość do właścicieli serwerów.
        `)
                        .setFooter({ text: `Bot stworzony przez: ${process.env.AUTHOR}` })
                        .setTimestamp()
                    ]

                })
            });

        })
    }
};