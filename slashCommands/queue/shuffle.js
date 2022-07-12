/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed } = require('discord.js');

/** SHUFFLE SLASH COMMAND */

let shuffleVotes = []; // votes

module.exports = {
    name: 'shuffle',
    description: 'Jednorazowe wymieszanie kolejki utworów (głosowanie)',

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

        if (shuffleVotes.some((x) => x === msgInt.author.id)) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription(`🗳️ | Twój głos został już zapisany!`)
                ],
                ephemeral: true,
            });
        };

        /** message */

        shuffleVotes.push(msgInt.author.id);
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
                    .setDescription(`🗳️ | Głosujesz za **wymieszaniem kolejki utworów** (**${shuffleVotes.length}**/${required} ${votes}).`)
                ],
            });
        };

        /** COMMAND */

        if (shuffleVotes.length >= required) {

            client.distube.shuffle(msgInt) // execute command

            shuffleVotes = []; // reset votes

            // translation

            const rest = queue.songs.length % 10;

            if (queue.songs.length === 1) songs = 'utwór'
            else if (rest > 1 || rest < 5) songs = 'utwory'
            else if (rest < 2 || rest > 4) songs = 'utworów'

            // print command message

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription(`🔀 | Wymieszano kolejkę zawierającą **${queue.songs.length}** ${songs}.`)
                ],
            });
        };

        /** event */

        client.distube.on('initQueue', (queue) => {
            return shuffleVotes = []; // reset votes
        });

    },
};