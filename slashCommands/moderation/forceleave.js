/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** FORCE LEAVE SLASH COMMAND */

module.exports = {
    name: 'forceleave',
    description: 'Wymuszenie wyjścia z kanału głosowego',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {

        /** DEFINE */

        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        client.distube.voices.get(msgInt).leave(); // execute command

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR2)
                .setDescription('🚪 | Wyszedłem z kanału głosowego!')
            ],
        }).then(autoDelete(msgInt));

    },
};