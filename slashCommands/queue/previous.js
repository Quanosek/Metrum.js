/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** PREVIOUS SLASH COMMAND */

let previousVotes = []; // votes

module.exports = {
    name: 'previous',
    description: 'Odtworzenie poprzednio granego utworu w kolejce (głosowanie)',

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
        else if (!queue || queue.previousSongs.length < 1)
            errorEmbed.setDescription('Nie znaleziono poprzedniego utworu!');

        if (errorEmbed.description) // print error embed
            return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

        /** VOTING SYSTEM */

        let users = uservoice.members.size;

        uservoice.members.forEach(member => {
            if (member.user.bot) users = users - 1;
        });

        const required = Math.ceil(users / 2);

        /** error */

        if (previousVotes.some((x) => x === msgInt.author.id)) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🗳️ | Twój głos został już zapisany!`)
                ],
                ephemeral: true,
            });
        };

        /** message */

        previousVotes.push(msgInt.author.id);
        process.setMaxListeners(Infinity);

        // print voting message

        if (required > 1) {

            // translation

            const rest = votes % 10;

            if (rest > 1 || rest < 5) votes = 'głosy'
            else if (rest < 2 || rest > 4) votes = 'głosów'

            // message

            msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR2)
                    .setDescription(`🗳️ | Głosujesz za **wymieszaniem kolejki utworów** (**${previousVotes.length}**/${required} ${votes}).`)
                ],
            });
        };

        /** COMMAND */

        if (previousVotes.length >= required) {

            client.distube.previous(msgInt); // execute command

            return previousVotes = []; // reset votes
        };

        /** event */

        client.distube.on('playSong', (queue, song) => {
            return previousVotes = []; // reset votes
        });

    },
};