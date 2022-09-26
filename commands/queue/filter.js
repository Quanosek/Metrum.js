// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "filter",
  aliases: ["f"],
  description:
    "Ustaw filtr na odtwarzaną muzykę (ponowne wybranie danego filtru, wyłączy go)",

  async run(client, prefix, msg, args) {
    // define
    const choice = args[0];
    const modes = [
      "disable",
      "3d",
      "bassboost",
      "earwax",
      "echo",
      "flanger",
      "gate",
      "haas",
      "karaoke",
      "mcompand",
      "nightcore",
      "phaser",
      "reverse",
      "surround",
      "tremolo",
      "vaporwave",
    ];

    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

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

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    // no choices (info)
    if (!choice) {
      msg.react("🪄"), autoDelete(msg, "1m");

      let modeText = modes.join("`, `");

      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR2)
        .setTitle("⚙️ | Menu filtrów:")
        .setDescription(
          "Możesz ustawić filtr na odtwarzane utwory w danej sesji."
        )
        .addFields({ name: "Dostępne tryby:", value: `\`${modeText}\`` })
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
      return msg.channel
        .send({ embeds: [embed] })
        .then((msg) => autoDelete(msg, "1m"));
    }

    // chosen choices
    if (modes.includes(choice)) {
      msg.react("✅");

      // disable all filters
      if (choice === "disable") {
        // execute command
        queue.filters.clear();

        // print command message
        return msg.channel.send({
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
      if (queue.paused) client.distube.resume(msg);

      // print message embed
      if (queue.filters.size === 0) {
        return msg.channel.send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR1)
              .setDescription("🪄 | Żaden filtr **nie jest aktywny**."),
          ],
        });
      }

      // print default message embed
      return msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              `🪄 | **Włączone filtry**: \`${queue.filters.names.join(
                "`, `"
              )}\``
            ),
        ],
      });
    } else {
      msg.react("❌"), autoDelete(msg);

      // print message embed on wrong filter name
      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription("🪄 | Podano **nieprawidłową nazwę** filtru!"),
          ],
        })
        .then((msg) => autoDelete(msg));
    }
  },
};
