/** IMPORT */

require('dotenv').config();
const { INVITE, COLOR1, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE SLASH COMMAND */

module.exports = {
    name: 'invite',
    description: 'Zaproś mnie na swój serwer',

    async run(client, msgInt) {

        /** COMMAND */

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle('**📧 | Zaproś mnie na swój serwer!**')
                .setURL(INVITE)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
        }).then(autoDelete(msgInt, 20));


    },
};