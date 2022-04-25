/** IMPORT */

require('dotenv').config();
const { AUTHOR_NAME } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PING COMMAND */

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'ping',

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
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME}` })
                    .setTimestamp()
                ],
            });

        }).then(msg => autoDelete(msg));

    },
};