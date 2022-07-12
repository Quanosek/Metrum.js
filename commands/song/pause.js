/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** PAUSE COMMAND */

module.exports = {
    name: 'pause',
    aliases: ['ps'],
    description: 'Wstrzymanie/wznowienie odtwarzania utworu',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na żadnym kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany żaden utwór!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        if (queue.playing) {

            client.distube.pause(msg); //execute command

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('⏸️ | **Wstrzymano** odtwarzanie.')
                ],
            });
        };

        if (queue.paused) {

            client.distube.resume(msg); // execute command

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('▶️ | **Wznowiono** odtwarzanie.')
                ],
            });
        };

    },
};