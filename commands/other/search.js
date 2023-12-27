import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "search",
  aliases: ["sr"],
  description:
    "Wyszukiwanie utworów podobnych do obecnie granego lub po podanym tytule",

  async run(client, prefix, msg, args) {
    // define
    let title = args.join(" ");
    const queue = client.distube.getQueue(msg);

    if (!title) {
      if (!queue) {
        msg.react("❌"), autoDelete(msg);

        return msg.channel
          .send({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(process.env.COLOR_ERR)
                .setDescription(
                  "Obecnie **nie jest odtwarzamy żaden utwór**, ani **nie został podany żaden tytuł**!"
                ),
            ],
          })
          .then((msg) => autoDelete(msg));
      }

      title = queue.songs[0].name; // default value
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

      msg.react("✅");

      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR2)
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
      return msg.channel.send({ embeds: [embed], components: [buttons] });
    } catch (err) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription("**Brak wyników** wyszukiwania!"),
          ],
        })
        .then((msg) => autoDelete(msg));
    }
  },
};
