/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SKIP SLASH COMMAND */

let skipVotes = []; // votes

module.exports = {
    name: 'skip',
    description: 'Pominięcie obecnie granego utworu (głosowanie)',

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

        /** VOTING SYSTEM */

        let users = uservoice.members.size;

        uservoice.members.forEach(member => {
            if (member.user.bot) users = users - 1;
        });

        const required = Math.ceil(users / 2);

        /** error */

        if (skipVotes.some((x) => x === msgInt.author.id)) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🗳️ | Twój głos został już zapisany!`)
                ],
                ephemeral: true,
            });
        };

        /** voting message */

        // translation

        const rest = votes % 10;

        if (rest > 1 || rest < 5) votes = 'głosy'
        else if (rest < 2 || rest > 4) votes = 'głosów'

        // message content

        let voteText, skipText;

        if (msgInt.type === 'APPLICATION_COMMAND') { // slash command
            voteText = `🗳️ | Głosujesz za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`
            skipText = '⏭️ | Pominięto utwór.'
        } else { // button interaction
            voteText = `🗳️ | ${msgInt.member.user} głosuje za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`
            skipText = `⏭️ | ${msgInt.member.user} pominął/pominęła utwór.`
        };

        skipVotes.push(msgInt.member.user.id);
        process.setMaxListeners(Infinity);

        // print voting message

        if (required > 1) {

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription(voteText)
                ],
            });
        };

        /** COMMAND */

        if (skipVotes.length >= required) {

            // execute command

            if (queue.paused) client.distube.resume(msgInt);

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msgInt);
                else client.distube.stop(msgInt);
            } else client.distube.skip(msgInt);

            skipVotes = []; // reset votes

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(skipText)
                ],
            });
        };

        /** event */

        client.distube.on('playSong', (queue, song) => {
            return skipVotes = []; // reset votes
        });

    },
};