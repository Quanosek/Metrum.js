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

    async run(client, msg, args, prefix) {

        /* <--- command ---> */

        msg.react('✅');
        msgAutoDelete(msg);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(process.env.COLOR1)
                .setTitle('📧 | Zaproś mnie na swój serwer!')
                .setDescription(`
[Metrum](${process.env.INVITE}) | [Metrum 2]() | [Metrum 3]()
        `)
                .setFooter(`Bot stworzony przez: ${process.env.AUTHOR}`)
                .setTimestamp()
            ]
        }).then(msg => msgAutoDelete(msg));

    }
};