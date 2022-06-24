/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** PAUSE SLASH COMMAND */

module.exports = {
    name: 'pause',
    description: 'Wstrzymanie/wznowienie odtwarzania utworu',

    async run(client, msgInt) {

        const queue = client.distube.getQueue(msgInt);
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

        let pauseText, resumeText;

        if (msgInt.type === 'APPLICATION_COMMAND') {
            pauseText = '⏸️ | Wstrzymano odtwarzanie.'
            resumeText = '▶️ | Wznowiono odtwarzanie.'
        } else { // button interaction
            pauseText = `⏸️ | ${msgInt.member.user} wstrzymał(a) odtwarzanie.`
            resumeText = `▶️ | ${msgInt.member.user} wznowił(a) odtwarzanie.`
        };

        if (queue.playing) {

            client.distube.pause(msgInt); //execute command

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(pauseText)
                ],
            });
        };

        if (queue.paused) {

            client.distube.resume(msgInt); // execute command

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(resumeText)
                ],
            });
        };

    },
};