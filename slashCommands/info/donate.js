/** IMPORT */

require('dotenv').config();
const { DONATE, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** INVITE SLASH COMMAND */

module.exports = {
    name: 'donate',
    description: 'Wspomóż twórcę i doceń jego pracę',

    async run(client, msgInt) {

        /** MESSAGE */

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle('**🪙 | Wspomóż twórcę i doceń jego pracę!**')
                .setURL(DONATE)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
        }).then(autoDelete(msgInt, 20));

    },
};