/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** RESUME SLASH COMMAND */

module.exports = {
    name: 'resume',
    description: 'Wznowienie odtwarzania utworu',

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

        /** OTHER ERROR */

        if (queue.playing) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Utwór jest już odtwarzany!')
                ],
                ephemeral: true,
            });
        };

        /** COMMAND */

        if (queue.paused) {

            client.distube.resume(msgInt); // execute command

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('▶️ | Wznowiono odtwarzanie.')
                ],
            });
        };

    },
};