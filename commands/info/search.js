/* <--- Import ---> */

require('dotenv').config();
const prefix = process.env.PREFIX;
const color_err = process.env.COLOR_ERR;
const color1 = process.env.COLOR1;
const color2 = process.env.COLOR2;

const { MessageEmbed } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');


/* <--- Command ---> */

module.exports = {
    name: 'search',
    aliases: ['sr', 'find', 'f'],
    description: 'wyszukiwanie utworów po podanym tytule',

    async run(client, prefix, msg, args) {

        /* <--- errors ---> */

        const name = args.join(' ');

        if (!name) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(color_err)
                    .setDescription('Musisz jeszcze wpisać **nazwę utworu**, który chcesz wyszukać!')
                ]
            }).then(msg => autoDelete(msg));
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
                .setColor(color1)
                .setTitle(`🔍 | Wyniki wyszukiwania dla: \`${name}\``)
                .setDescription(searchResult)
                .setFooter({ text: `${prefix}play <nazwa/link>` })
                .setTimestamp()
            ]
        });

    }
};