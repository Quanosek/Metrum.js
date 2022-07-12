/** IMPORT */

require('dotenv').config();
const { COLOR_ERR, COLOR1, COLOR2 } = process.env;

const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const autoDelete = require('../../functions/autoDelete.js');

/** SEARCH COMMAND */

module.exports = {
    name: 'search',
    aliases: ['sr'],
    description: 'Wyszukiwanie utworów podobnych do obecnie granego lub po podanym tytule',

    async run(client, prefix, msg, args) {

        /** DEFINE */

        let title = args.join(' ');
        const queue = client.distube.getQueue(msg);

        if (!title) {

            if (!queue) {
                msg.react('❌'), autoDelete(msg);

                return msg.channel.send({
                    embeds: [new MessageEmbed()
                        .setColor(COLOR_ERR)
                        .setDescription('Obecnie **nie jest odtwarzamy żaden utwór**, ani **nie został podany żaden tytuł**!')
                    ],
                }).then(msg => autoDelete(msg));
            };

            title = queue.songs[0].name; // default value
        };

        /** COMMAND */

        try {

            const result = await client.distube.search(title);
            let searchResult = '';

            for (let i = 0; i < 10; i++) {
                searchResult += `**${i + 1}.** [${result[i].name}](${result[i].url}) - \`${result[i].formattedDuration}\`\n`
            };

            msg.react('✅');

            /** message */

            const embed = new MessageEmbed()
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

            return msg.channel.send({ embeds: [embed], components: [buttons] }); // print message

        } catch (err) { // other error
            msg.react('❌'), autoDelete(msg);

            return msg.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(COLOR_ERR)
                    .setDescription('Nie znaleziono żadnych wyników wyszukiwania!')
                ],
            }).then(msg => autoDelete(msg));
        };

    },
};