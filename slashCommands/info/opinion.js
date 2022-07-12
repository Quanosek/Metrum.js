/** IMPORT */

require('dotenv').config();
const { OPINION, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE SLASH COMMAND */

module.exports = {
    name: 'opinion',
    description: 'Podziel się swoją opinią na temat bota',

    async run(client, msgInt) {

        /** MESSAGE */

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle('**📣 | Podziel się swoją opinią na temat bota!**')
                .setURL(OPINION)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
        }).then(autoDelete(msgInt, 20));

    },
};