// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "filter",
  description:
    "Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru wyłączy go)",

  options: [
    {
      name: "choice",
      description: "Wybierz filtr",
      type: 3, // string
      choices: [
        { name: "disable", value: "disable" },
        { name: "3d", value: "3d" },
        { name: "bassboost", value: "bassboost" },
        { name: "earwax", value: "earwax" },
        { name: "echo", value: "echo" },
        { name: "flanger", value: "flanger" },
        { name: "gate", value: "gate" },
        { name: "haas", value: "haas" },
        { name: "karaoke", value: "karaoke" },
        { name: "mcompand", value: "mcompand" },
        { name: "nightcore", value: "nightcore" },
        { name: "phaser", value: "phaser" },
        { name: "reverse", value: "reverse" },
        { name: "surround", value: "surround" },
        { name: "tremolo", value: "tremolo" },
        { name: "vaporwave", value: "vaporwave" },
      ],
    },
  ],

  async run(client, msgInt) {
    // define
    const choice = msgInt.options.getString("choice");
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    else if (!uservoice || botvoice != uservoice)
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    else if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // no choices (info)
    if (!choice) {
      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR2)
        .setTitle("⚙️ | Menu filtrów:")
        .setDescription(
          "Możesz ustawić wybrane filtry z listy na odtwarzane utwory w danej sesji."
        )
        .setFooter({
          text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
        });

      if (queue.filters.size !== 0) {
        embed.addFields({
          name: "Włączone:",
          value: `\`${queue.filters.names.join("`, `")}\``,
        });
      }

      // print message embed
      return msgInt.reply({ embeds: [embed] }).then(autoDelete(msgInt, 30));
    }

    // disable all filters
    if (choice === "disable") {
      // execute command
      queue.filters.clear();

      // print command message
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription("🪄 | **Wyłączono** wszystkie filtry."),
        ],
      });
    }

    // execute command
    if (queue.filters.names.includes(choice)) queue.filters.remove(choice);
    else queue.filters.add(choice);
    if (queue.paused) client.distube.resume(msgInt);

    // print message embed
    if (queue.filters.size === 0) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription("🪄 | Żaden filtr **nie jest aktywny**."),
        ],
      });
    }

    // print default message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(
            "🪄 | **Włączone filtry**: " +
              `\`${queue.filters.names.join("`, `")}\``
          ),
      ],
    });
  },
};
