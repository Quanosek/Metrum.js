/** IMPORT */

require('dotenv').config();
const { INVITE, COLOR1, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE COMMAND */

module.exports = {
    name: 'invite',
    aliases: ['iv'],
    description: 'zaproszenia',

    async run(client, prefix, msg, args) {

        /* <--- command ---> */

        msg.react('✅');
        autoDelete(msg, 20);

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle('**📧 | Zaproś mnie na swój serwer!**')
                .setURL(INVITE)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
        }).then(msg => autoDelete(msg, 20));

    },
};