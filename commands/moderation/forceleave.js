/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR2 } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FORCE LEAVE COMMAND */

module.exports = {
    name: 'forceleave',
    aliases: ['fl'],
    description: 'wymuszenie wyjścia z kanału głosowego',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        const botvoice = msg.guild.me.voice.channel
        const uservoice = msg.member.voice.channel

        /** COMMON ERRORS */

        if (!botvoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        autoDelete(msg);

        client.distube.voices.get(msg).leave(); // execute command

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🚪 | Wyszedłem z kanału głosowego!')
            ],
        }).then(msg => autoDelete(msg));

    },
};