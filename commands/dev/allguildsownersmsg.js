/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const config = require('../../bot/config.js').config();
const msgAutoDelete = require('../../functions/msgAutoDelete.js')


/* <--- Command ---> */

module.exports = {
    name: 'allguildsownersmsg',
    aliases: ['agom'],
    category: 'dev',
    description: 'test',

    async run(client, msg, args, prefix) {

        /* <--- dev only ---> */

        const msgAuthor = msg.author.username + '#' + msg.author.discriminator;

        if (!(msgAuthor === config.author)) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(config.color_err)
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
                        .setColor(config.color1)
                        .setTitle(`Tytuł!`)
                        .setDescription(`
Wiadomość do właścicieli serwerów.
        `)
                        .setFooter(`Bot stworzony przez: ${config.author}`)
                        .setTimestamp()
                    ]

                })
            });

        })
    }
};