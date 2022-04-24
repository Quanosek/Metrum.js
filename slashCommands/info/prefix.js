/** IMPORT */

require('dotenv').config();
const { PREFIX, COLOR1, AUTHOR } = process.env;

const { MessageEmbed } = require('discord.js');

/** COMMAND */

module.exports = {
    name: 'prefix',
    description: 'Pokazuje prefix bota.',

    async run(client, interaction) {

        interaction.reply({ // send

            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription(`⚙️ | Mój prefix to: \`${PREFIX}\``)
                .setFooter({ text: `Autor bota: ${AUTHOR}` })
                .setTimestamp()
            ],
            ephemeral: true,

        });
    },
};