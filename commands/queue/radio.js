/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** RADIO COMMAND */

module.exports = {
    name: 'radio',
    aliases: ['r'],
    description: 'Auto-odtwarzanie podobnych utworów (radio utworu)',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        if (args[0] === 'enable' || args[0] === 'e') choice = 1;
        if (args[0] === 'disable' || args[0] === 'd') choice = 0;

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** ERRORS */

        const errorEmbed = new MessageEmbed() // create embed
            .setColor(COLOR_ERR)

        if (!botvoice)
            errorEmbed.setDescription('Nie jestem na **żadnym** kanale głosowym!');
        else if (!uservoice || botvoice != uservoice)
            errorEmbed.setDescription('Musisz być na kanale głosowym **razem ze mną**!');
        else if (!queue)
            errorEmbed.setDescription('Obecnie nie jest odtwarzany **żaden utwór**!');

        if (errorEmbed.description) { // print error embed
            msg.react('❌'), autoDelete(msg);
            return msg.channel.send({ embeds: [errorEmbed] }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');
        let mode = client.distube.toggleAutoplay(msg);

        // execute command

        if (!choice) {
            mode = mode ? '**Włączono**' : '**Wyłączono**';

        } else {
            queue.autoplay = choice;
            if (choice === 0) mode = '**Wyłączono**';
            if (choice === 1) mode = '**Włączono**';
        };

        // print command message

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setDescription('📻 | ' + mode + ' auto-odtwarzanie (radio utworu).')
            ],
        });

    },
};