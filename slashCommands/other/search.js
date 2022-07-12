/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

/** SEARCH SLASH COMMAND */

module.exports = {
    name: 'search',
    description: 'Wyszukiwanie utworów podobnych do obecnie granego lub po podanym tytule',

    options: [{
        name: 'title',
        description: 'Podaj tytuł utworu, który chcesz wyszukać',
        type: 'STRING',
    }],

    async run(client, msgInt) {

        /** MESSAGE TYPE DEFINE */

        if (msgInt.type === 'APPLICATION_COMMAND') { // slash command

            title = msgInt.options.getString('title');
            const queue = client.distube.getQueue(msgInt);

            if (!title) {

                if (!queue) {

                    return msgInt.reply({
                        embeds: [new MessageEmbed()
                            .setColor(COLOR_ERR)
                            .setDescription('Obecnie **nie jest odtwarzamy żaden utwór**, ani **nie został podany żaden tytuł**!')
                        ],
                        ephemeral: true,
                    });
                };

                title = queue.songs[0].name; // default value
            };

        } else { // button interaction

            title = msgInt.customLink;
        };

        /** COMMAND */

        try {

            const result = await client.distube.search(title);
            let searchResult = '';

            for (let i = 0; i < 10; i++) {
                searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
            };

            /** message */

            const embed = new MessageEmbed() // main message
                .setColor(COLOR1)
                .setTitle(`🔎 | Wyniki wyszukiwania dla: \`${title}\``)
                .setDescription(searchResult)
                .setFooter({ text: 'możesz szybko wybrać, który utwór chcesz odtworzyć:' })

            /** buttons */

            let buttons = new MessageActionRow()

            for (let i = 0; i < 5; i++) {
                buttons.addComponents(
                    new MessageButton()
                    .setCustomId(`search-${title}-${i+1}`)
                    .setStyle('SECONDARY')
                    .setLabel(`${i+1}`)
                );
            };

            return msgInt.reply({ embeds: [embed], components: [buttons] }); // print message

        } catch (err) { // other error

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