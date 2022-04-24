/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'ping',

    async run(client, prefix, msg, args) {

        /* <--- command ---> */

        msg.react('🏓')
        autoDelete(msg);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor('RANDOM')
                .setDescription('pong!')
            ]
        }).then(resultmsg => {

            const ping = resultmsg.createdTimestamp - msg.createdTimestamp

            return resultmsg.edit({
                embeds: [new MessageEmbed()
                    .setColor('RANDOM')
                    .setTitle('Opóźnienie:')
                    .setDescription(`Bot: \`${ping} ms\`\n API: \`${client.ws.ping} ms\``)
                ]
            });

        }).then(msg => autoDelete(msg));

    }
};