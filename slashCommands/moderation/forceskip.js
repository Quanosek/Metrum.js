/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** FORCE SKIP SLASH COMMAND */

module.exports = {
    name: 'forceskip',
    description: 'Wymuszenie pominięcia utworu',
    permissions: ['MANAGE_MESSAGES'],

    async run(client, msgInt) {

        /** DEFINE */

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // execute command

        if (queue.paused) client.distube.resume(msgInt);

        if (queue.songs.length < 2) {
            if (queue.autoplay) client.distube.skip(msgInt);
            else client.distube.stop(msgInt);
        } else client.distube.skip(msgInt);

        // print command message

        return msgInt.reply({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('⏭️ | Pominięto utwór.')
            ],
        });

    },
};