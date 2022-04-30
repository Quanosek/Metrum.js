/** IMPORT */

require('dotenv').config();
const { PREFIX, AUTHOR_NAME, AUTHOR_NICK, AUTHOR_HASH, COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

const schema = require('../../schemas/guilds.js');

/** PREFIX SLASH COMMAND */

module.exports = {
    name: 'prefix',
    description: 'Pokazuje prefix bota',

    async run(client, msgInt) {

        /** MANAGE DATABASE */

        let db = await schema.findOne({ guildId: msgInt.guild.id });
        if (!db) db = await schema.create({

            guildId: msgInt.guild.id,
            prefix: PREFIX,

        });

        let prefix = db.prefix; // custom prefix

        /** MESSAGE */

        msgInt.reply({ // send

            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⚙️ | Mój prefix to: \`${prefix}\``)
                .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
            ],
            ephemeral: true,

        });
    },
};