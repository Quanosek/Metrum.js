/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PING COMMAND */

module.exports = {
    name: 'ping',
    aliases: ['pg'],
    description: 'Ping-pong',

    async run(client, prefix, msg, args) {

        /** MESSAGE */

        msg.react('🏓'), autoDelete(msg);

        msg.channel.send({ // send

            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('🏓 | Pong!')
            ],

        }).then(resultmsg => {

            resultmsg.edit({ // modify sended
                embeds: [new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('🏓 | Pong!')
                    .setDescription(`
Opóźnienie bota: \`${resultmsg.createdTimestamp - msg.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                    `)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
            });
        }).then(msg => autoDelete(msg));

    },
};