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
        try {

            /** MANAGE DATABASE */

            const db = await schema.findOne({ guildId: msgInt.guild.id }); // database
            let prefix = db.prefix; // custom prefix

            /** MESSAGE */

            msgInt.reply({

                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`⚙️ | Mój prefix to: \`${prefix}\``)
                    .setFooter({ text: `Autor bota: ${AUTHOR_NAME} (${AUTHOR_NICK}#${AUTHOR_HASH})` })
                ],
                ephemeral: true,
            });

        } catch (err) {
            console.error(err);
        };
    },
};