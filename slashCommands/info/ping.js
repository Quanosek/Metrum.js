/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

/** PING SLASH COMMAND */

module.exports = {
    name: 'ping',
    description: 'Ping-pong',

    async run(client, msgInt) {

        msgInt.reply({ // send

            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('🏓 | Pong!')
            ],
            ephemeral: true,
            fetchReply: true,

        }).then(resultmsg => { // modify sended

            msgInt.editReply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle('🏓 | Pong!')
                    .setDescription(`
Opóźnienie bota: \`${resultmsg.createdTimestamp - msgInt.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                    `)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
            });
        });

    },
};