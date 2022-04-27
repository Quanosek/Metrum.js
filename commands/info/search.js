/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SEARCH COMMAND */

module.exports = {
    name: 'search',
    aliases: ['sr'],
    description: 'wyszukiwanie utworów po podanym tytule',

    async run(client, prefix, msg, args) {

        let name = args.join(' '); // song/video title

        /** ERROR */

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

        try {

            let result = await client.distube.search(name);
            let searchResult = '';

            for (let i = 0; i < 10; i++) {
                searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
            };

            msg.react('✅');

            /** message */

            const embed = new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`🔍 | Wyniki wyszukiwania dla: \`${name}\``)
                .setDescription(searchResult)
                .setFooter({ text: 'możesz szybko wybrać, który utwór chcesz odtworzyć:' })

            /** buttons */

            let buttons = new MessageActionRow()

            for (let i = 0; i < 5; i++) {
                buttons.addComponents(
                    new MessageButton()
                    .setCustomId(`search-${name}-${i+1}`)
                    .setStyle('SECONDARY')
                    .setLabel(`${i+1}`)
                );
            };

            return msg.channel.send({ embeds: [embed], components: [buttons] }); // print message

        } catch (err) {
            msg.react('❌');
            autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie znaleziono żadnych wyników wyszukiwania!')
                ],
            }).then(msg => autoDelete(msg));
        };
    },
};