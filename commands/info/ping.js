/* <--- Import ---> */

const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'ping',
    aliases: [],
    category: 'info',
    description: 'ping',

    async run(client, msg, args, prefix) {

        /* <--- command ---> */

        msg.react('🏓')
        msgAutoDelete(msg);

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

        }).then(msg => msgAutoDelete(msg));

    }
};