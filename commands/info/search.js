/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SEARCH COMMAND */

module.exports = {
    name: 'search',
    aliases: ['sr'],
    description: 'wyszukiwanie utworów po podanym tytule',

    async run(client, prefix, msg, args) {

        /** ERROR */

        const name = args.join(' '); // song/video title

        if (!name) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Musisz jeszcze wpisać **nazwę utworu**, który chcesz wyszukać!')
                ],
            }).then(msg => autoDelete(msg));
        };

        /** COMMAND */

        msg.react('✅');

        let result = await client.distube.search(name);
        let searchResult = '';

        for (let i = 0; i < 10; i++) {
            searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
        };

        return msg.channel.send({
            embeds: [new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`🔍 | Wyniki wyszukiwania dla: \`${name}\``)
                .setDescription(searchResult)
                .setFooter({ text: `${prefix}play <nazwa/link>` })
                .setTimestamp()
            ],
        });

    },
};