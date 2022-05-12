/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FORCE SLASH COMMAND */

module.exports = {
    name: 'forceleave',
    description: 'Wymuszenie wyjścia z kanału głosowego',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {

        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
                ephemeral: true,
            });
        };

        if (!uservoice || botvoice != uservoice) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        autoDelete(msgInt);

        client.distube.voices.get(msgInt).leave(); // execute command

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🚪 | Wyszedłem z kanału głosowego!')
            ],
        }).then(autoDelete(msgInt));

    },
};