/* <--- Import ---> */

require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

let shuffleVotes = [];

module.exports = {
    name: 'shuffle',
    aliases: ['sh'],
    category: 'queue',
    description: 'jednorazowe wymieszanie kolejki utworów (głosowanie)',

    async run(client, msg, args, prefix) {

        /* <--- errors ---> */

        const queue = client.distube.getQueue(msg);
        const botvoice = msg.guild.me.voice.channel;
        const uservoice = msg.member.voice.channel;

        if (!botvoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Nie jestem na żadnym kanale głosowym!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!uservoice || botvoice != uservoice) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Musisz być na kanale głosowym razem ze mną!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        if (!queue) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Obecnie nie jest odtwarzany *żaden utwór!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- voting system ---> */

        // define

        let users = uservoice.members.size;

        uservoice.members.forEach(member => {
            if (member.user.bot) {
                users = users - 1;
            };
        });

        const required = Math.ceil(users / 2);

        // errors

        if (shuffleVotes.some((x) => x === msg.author.id)) {
            msg.react('❌');
            msgAutoDelete(msg, 5);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription(`🗳️ | Już zagłosowałeś/aś!`)
                ]
            }).then(msg => msgAutoDelete(msg, 5));
        };

        // command

        shuffleVotes.push(msg.author.id);
        process.setMaxListeners(Infinity);

        if (required > 1) {
            msg.react('✅');

            let votes;
            let rest = votes % 10;

            if (rest > 1 || rest < 5) votes = 'głosy'
            else if (rest < 2 || rest > 4) votes = 'głosów'

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR2)
                    .setDescription(`🗳️ | Głosujesz za **wymieszaniem kolejki utworów** (**${shuffleVotes.length}**/${required} ${votes}).`)
                ]
            });
        };

        /* <--- command ---> */

        if (shuffleVotes.length >= required) {

            msg.react('✅');

            client.distube.shuffle(msg)

            let songs;
            let rest = queue.songs.length % 10;

            if (queue.songs.length === 1) songs = 'utwór'
            else if (rest > 1 || rest < 5) songs = 'utwory'
            else if (rest < 2 || rest > 4) songs = 'utworów'

            msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR1)
                    .setDescription(`🔀 | Wymieszano kolejkę zawierającą **${queue.songs.length}** ${songs}.`)
                ]
            });

            return shuffleVotes = [];

        };

        /* <--- events ---> */

        client.distube.on('playSong', (queue, song) => {
            return shuffleVotes = [];
        });

    }
};