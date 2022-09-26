// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "queue",
  description: "Informacje o obecnej kolejce utworów",

  async run(client, msgInt) {
    // define
    const botvoice = msgInt.guild.members.me.voice.channel;
    const queue = client.distube.getQueue(msgInt);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    else if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // create message embed
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR2)
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

    if (queue.songs.length < 2)
      embed.setFooter({
        text: "Aby dowiedzieć się więcej o tym utworze użyj komendy: nowplaying",
      });
    else
      embed.setFooter({
        text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
      });

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
    return msgInt.reply({ embeds: [embed] });
  },
};
