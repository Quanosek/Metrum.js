/* <--- Import ---> */

require('dotenv').config();
const { MessageEmbed } = require('discord.js');

const msgAutoDelete = require('../../functions/msgAutoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'search',
    aliases: ['sr', 'find', 'f'],
    category: 'info',
    description: 'wyszukiwanie utworów po podanym tytule',

    async run(client, msg, args, prefix) {

        /* <--- errors ---> */

        const name = args.join(' ');

        if (!name) {
            msg.react('❌');
            msgAutoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(process.env.COLOR_ERR)
                    .setDescription('Musisz jeszcze wpisać **nazwę utworu**, który chcesz wyszukać!')
                ]
            }).then(msg => msgAutoDelete(msg));
        };

        /* <--- command ---> */

        msg.react('✅');

        let result = await client.distube.search(name);
        let searchResult = '';

        for (let i = 0; i < 10; i++) {
            searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
        };

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(process.env.COLOR1)
                .setTitle(`🔍 | Wyniki wyszukiwania dla: \`${name}\``)
                .setDescription(searchResult)
                .setFooter(`${prefix}play <nazwa/link>`)
                .setTimestamp()
            ]
        });

    }
};