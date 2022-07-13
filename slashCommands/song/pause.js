/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** PAUSE SLASH COMMAND */

module.exports = {
    name: 'pause',
    description: 'Wstrzymanie/wznowienie odtwarzania utworu',

    async run(client, msgInt) {

        /** DEFINE */

        const queue = client.distube.getQueue(msgInt);
        const botvoice = msgInt.guild.me.voice.channel;
        const uservoice = msgInt.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** COMMAND */

        // message content

        if (msgInt.type === 'APPLICATION_COMMAND') {
            pauseText = '⏸️ | **Wstrzymano** odtwarzanie.'
            resumeText = '▶️ | **Wznowiono** odtwarzanie.'
        } else { // button interaction
            pauseText = `⏸️ | **${msgInt.member.user} wstrzymał(a)** odtwarzanie.`
            resumeText = `▶️ | **${msgInt.member.user} wznowił(a)** odtwarzanie.`
        };

        if (queue.playing) {

            client.distube.pause(msgInt); //execute command

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(pauseText)
                ],
            });
        };

        if (queue.paused) {

            client.distube.resume(msgInt); // execute command

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(resumeText)
                ],
            });
        };

    },
};