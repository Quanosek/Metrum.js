/* <--- Import ---> */

require('dotenv').config();

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

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
                .setColor(process.env.COLOR1)
                .setTitle('📧 | Zaproś mnie na swój serwer!')
                .setDescription(`[Kliknij tutaj!](${process.env.INVITE})`)
                .setFooter({ text: `Bot stworzony przez: ${process.env.AUTHOR}` })
                .setTimestamp()
            ]
        }).then(msg => autoDelete(msg));

    }
};