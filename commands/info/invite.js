/** IMPORT */

require('dotenv').config();
const { INVITE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE COMMAND */

module.exports = {
    name: 'invite',
    aliases: ['iv'],
    description: 'Zaproś mnie na swój serwer',

    async run(client, prefix, msg, args) {

        /** COMMAND */

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