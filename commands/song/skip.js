/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SKIP COMMAND */

let skipVotes = []; // votes

module.exports = {
    name: 'skip',
    aliases: ['s'],
    description: 'Pominięcie obecnie granego utworu (głosowanie)',

    async run(client, prefix, msg, args) {

        /** DEFINE */

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

        /** VOTING SYSTEM */

        let users = uservoice.members.size;

        uservoice.members.forEach(member => {
            if (member.user.bot) users = users - 1;
        });

        const required = Math.ceil(users / 2);

        /** error */

        if (skipVotes.some((x) => x === msg.author.id)) {
            msg.react('❌'), autoDelete(msg, 5);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🗳️ | Twój głos został już zapisany!`)
                ],
            }).then(msg => autoDelete(msg, 5));
        };

        /** message */

        skipVotes.push(msg.author.id);
        process.setMaxListeners(Infinity);

        // print voting message

        if (required > 1) {

            msg.react('✅');

            // translation

            const rest = votes % 10;

            if (rest > 1 || rest < 5) votes = 'głosy'
            else if (rest < 2 || rest > 4) votes = 'głosów'

            // message

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription(`🗳️ | Głosujesz za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`)
                ],
            });
        };

        /** COMMAND */

        if (skipVotes.length >= required) {

            msg.react('✅');

            // execute command

            if (queue.paused) client.distube.resume(msg);

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msg);
                else client.distube.stop(msg);
            } else client.distube.skip(msg);

            skipVotes = []; // reset votes

            // print command message

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('⏭️ | Pominięto utwór.')
                ],
            });
        };

        /** event */

        client.distube.on('playSong', (queue, song) => {
            return skipVotes = []; // reset votes
        });

    },
};