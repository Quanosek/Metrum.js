/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PING COMMAND */

module.exports = {
    name: 'ping',
    aliases: ['pg'],
    description: 'Ping-pong',

    async run(client, prefix, msg, args) {

        /** COMMAND */

        msg.react('🏓')
        autoDelete(msg);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('pong!')
            ],
        }).then(resultmsg => {

            return resultmsg.edit({ // modify sended
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