import discord from "discord.js";

export default {
  name: "search",
  description:
    "Wyszukiwanie utworów podobnych do obecnie granego lub po podanym tytule",

  options: [
    {
      name: "title",
      description: "Podaj tytuł utworu, który chcesz wyszukać",
      type: 3, // string
    },
  ],

  async run(client, msgInt) {
    let title;

    // interactions types description
    if (msgInt.type === 20) {
      // ChatInputCommand

      let title = msgInt.options.getString("title");
      const queue = client.distube.getQueue(msgInt);

      if (!title) {
        if (!queue) {
          return msgInt.reply({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(client.config.color.error)
                .setDescription(
                  "Obecnie **nie jest odtwarzamy żaden utwór**, ani **nie został podany żaden tytuł**!"
                ),
            ],
            ephemeral: true,
          });
        }

        title = queue.songs[0].name; // default value
      }
    } else {
      // Button
      title = msgInt.customLink;
    }

    // execute command
    try {
      const result = await client.distube.search(title);
      let searchResult = "";

      for (let i = 0; i < 10; i++) {
        searchResult += `**${i + 1}.** [${result[i].name}](${
          result[i].url
        }) - \`${result[i].formattedDuration}\`\n`;
      }

      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(client.config.color.secondary)
        .setTitle(`🔎 | Wyniki wyszukiwania dla: \`${title}\``)
        .setDescription(searchResult)
        .setFooter({
          text: "możesz szybko wybrać, który utwór chcesz odtworzyć:",
        });

      // create buttons
      let buttons = new discord.ActionRowBuilder();

      for (let i = 0; i < 5; i++) {
        buttons.addComponents(
          new discord.ButtonBuilder()
            .setCustomId(`search-${title}-${i + 1}`)
            .setStyle(2) // Secondary
            .setLabel(`${i + 1}`)
        );
      }

      // print message embed
      return msgInt.reply({ embeds: [embed], components: [buttons] });
    } catch (err) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.error)
            .setDescription("**Brak wyników** wyszukiwania!"),
        ],
        ephemeral: true,
      });
    }
  },
};
