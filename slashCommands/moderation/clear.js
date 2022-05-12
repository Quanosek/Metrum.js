/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** CLEAR SLASH COMMAND */

module.exports = {
    name: 'clear',
    description: 'Wyczyszczenie całej kolejki (łącznie z obecnie granym utworem)',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {
        try {

            const queue = client.distube.getQueue(msgInt);
            const botvoice = msgInt.guild.me.voice.channel;
            const uservoice = msgInt.member.voice.channel;

            /** COMMON ERRORS */

            if (botvoice && (!uservoice || botvoice != uservoice)) {

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Musisz być na kanale głosowym razem ze mną!')
                    ],
                    ephemeral: true,
                });
            };

            if (!queue) {

                return msgInt.reply({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                    ],
                    ephemeral: true,
                });
            };

            /** COMMAND */

            client.distube.stop(msgInt); // execute command

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription('🧹 | Wyczyszczono kolejkę bota.')
                ],
            });

        } catch (err) {
            console.error(err);
        };
    },
};