/* <--- Import ---> */

require('dotenv').config();

const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    category: 'info',
    description: 'zaproszenia',

    async run(client, msg, args) {

        /* <--- command ---> */

        msg.react('✅');
        msgAutoDelete(msg);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(process.env.COLOR1)
                .setTitle('📧 | Zaproś mnie na swój serwer!')
                .setDescription(`[Kliknij tutaj!](${process.env.INVITE})`)
                .setFooter(`Bot stworzony przez: ${process.env.AUTHOR}`)
                .setTimestamp()
            ]
        }).then(msg => msgAutoDelete(msg));

    }
};