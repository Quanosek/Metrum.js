/** IMPORT */

require('dotenv').config();
const { COLOR1 } = process.env;

const { MessageEmbed } = require('discord.js');

/** COMMAND */

module.exports = {
    name: 'ping',
    description: 'Ping-Pong!',

    async run(client, interaction) {

        interaction.reply({ // send

            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('🏓 | Pong!')
            ],
            ephemeral: true,
            fetchReply: true,

        }).then(resultmsg => { // modify sended

            interaction.editReply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setTitle('🏓 | Pong!')
                    .setDescription(`
Opóźnienie bota: \`${resultmsg.createdTimestamp - interaction.createdTimestamp} ms\`
Opóźnienie API: \`${client.ws.ping} ms\`
                `),
                ],
            });
        });

    },
};