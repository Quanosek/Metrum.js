/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/** SEARCH SLASH COMMAND */

module.exports = {
    name: 'search',
    description: 'Wyszukiwanie utworów',

    options: [{
        name: 'song',
        description: 'Podaj tytuł utworu, który chcesz wyszukać',
        type: 'STRING',
        required: true,
    }],

    async run(client, msgInt) {

        const song = msgInt.options.getString('song');

        /** COMMAND */

        try {

            let result = await client.distube.search(song);
            let searchResult = '';

            for (let i = 0; i < 10; i++) {
                searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
            };

            /** message */

            const embed = new MessageEmbed()
                .setColor(COLOR1)
                .setTitle(`🔍 | Wyniki wyszukiwania dla: \`${song}\``)
                .setDescription(searchResult)
                .setFooter({ text: 'możesz szybko wybrać, który utwór chcesz odtworzyć:' })

            /** buttons */

            let buttons = new MessageActionRow()

            for (let i = 0; i < 5; i++) {
                buttons.addComponents(
                    new MessageButton()
                    .setCustomId(`search-${song}-${i+1}`)
                    .setStyle('SECONDARY')
                    .setLabel(`${i+1}`)
                );
            };

            return msgInt.reply({ embeds: [embed], components: [buttons] }); // print message

        } catch (err) {

            return msgInt.reply({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie znaleziono żadnych wyników wyszukiwania!')
                ],
                ephemeral: true,
            });
        };

    },
};