/** IMPORT */

require('dotenv').config();
const { INVITE, COLOR1, AUTHOR_NAME } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE COMMAND */

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: 'zaproszenia',

    async run(client, prefix, msg, args) {

        /* <--- command ---> */

        msg.react('✅');
        autoDelete(msg);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle('📧 | Zaproś mnie na swój serwer!')
                .setDescription(`[Kliknij tutaj!](${INVITE})`)
                .setFooter({ text: `Bot stworzony przez: ${AUTHOR_NAME}` })
                .setTimestamp()
            ],
        }).then(msg => autoDelete(msg));

    },
};