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

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        /** COMMON ERRORS */

        if (!botvoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ],
            }).then(msg => autoDelete(msg));
        };

        if (!queue) {
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany żaden utwór!')
                ],
            }).then(msg => autoDelete(msg));
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
                    .setDescription(`🗳️ | Już oddał*ś swój głos!`)
                ],
            }).then(msg => autoDelete(msg, 5));
        };

        /** voting */

        skipVotes.push(msg.author.id);
        process.setMaxListeners(Infinity);

        if (required > 1) {

            msg.react('✅');

            // translation

            let votes, rest = votes % 10;
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

            if (queue.paused) client.distube.resume(msg);

            if (queue.songs.length < 2) {
                if (queue.autoplay) client.distube.skip(msg);
                else client.distube.stop(msg);
            } else client.distube.skip(msg);

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR1)
                    .setDescription('⏭️ | Pominięto utwór.')
                ],
            });

            return skipVotes = [];
        };

        /** EVENT */

        client.distube.on('playSong', (queue, song) => {
            return skipVotes = [];
        });

    },
};