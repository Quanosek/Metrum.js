import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "queue",
  aliases: ["q"],
  description: "Informacje o obecnej kolejce utworów",

  async run(client, prefix, msg, args) {
    // define
    const botvoice = msg.guild.members.me.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice) {
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    } else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // create message embed
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR1)
      .setTitle("💿 | Kolejka utworów:")
      .setDescription(
        queue.songs
          .map(
            (song, id) =>
              `**${id + 1}.** [${song.name}](${song.url}) - \`${
                song.formattedDuration
              }\``
          )
          .slice(0, 30)
          .join("\n")
      );

    if (queue.songs.length < 2) {
      embed.setFooter({
        text: "Aby dowiedzieć się więcej o tym utworze użyj komendy: nowplaying",
      });
    } else {
      embed.setFooter({
        text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
      });
    }

    // translation
    let songs;
    const rest = queue.songs.length % 10;

    if (queue.songs.length === 1) songs = "utwór";
    else if (rest < 2 || rest > 4) songs = "utworów";
    else if (rest > 1 || rest < 5) songs = "utwory";

    // create field
    if (queue.songs.length > 30) {
      embed.addFields({
        name: "Łącznie w kolejce:",
        value: `**${queue.songs.length} ${songs}!**`,
        inline: true,
      });
    }

    // show enabled options
    if (
      queue.paused ||
      queue.repeatMode ||
      queue.autoplay ||
      queue.filters.size !== 0
    ) {
      let params = "";
      if (queue.paused) params += "`⏸️|pauza` \n";
      if (queue.repeatMode === 1) params += "`🔂|zapętlanie utworu` \n";
      if (queue.repeatMode === 2) params += "`🔁|zapętlanie kolejki` \n";
      if (queue.autoplay) params += "`📻|auto-odtwarzanie` \n";
      if (queue.filters.size !== 0)
        params += "`🪄|filtry: " + queue.filters.names.join(", ") + "` \n";

      embed.addFields({ name: "Włączone opcje:", value: params });
    }

    // print message embed
    return msg.channel.send({ embeds: [embed] });
  },
};
