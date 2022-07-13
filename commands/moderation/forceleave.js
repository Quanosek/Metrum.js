/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FORCE LEAVE COMMAND */

module.exports = {
    name: 'forceleave',
    aliases: ['fl'],
    description: 'Wymuszenie wyjścia z kanału głosowego',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅'), autoDelete(msg);
        client.distube.voices.get(msg).leave(); // execute command

        // print command message

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🚪 | Wyszedłem z kanału głosowego!')
            ],
        }).then(msg => autoDelete(msg));

    },
};