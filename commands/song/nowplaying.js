import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "nowplaying",
  aliases: ["np"],
  description: "Informacje o obecnie odtwarzanym utworze",

  async run(client, prefix, msg, args) {
    // define
    let song;
    const botvoice = msg.guild.members.me.voice.channel;
    const queue = client.distube.getQueue(msg);
    if (queue) song = queue.songs[0];

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
      .setColor(process.env.COLOR2)
      .setTitle("🎵 | Teraz odtwarzane:")
      .setThumbnail(song.thumbnail);

    let timeValue;
    if (song.isLive) timeValue = `\`Live\``;
    else
      timeValue = `\`${queue.formattedCurrentTime}\` / \`${song.formattedDuration}\``;

    embed.addFields(
      {
        name: "Tytuł:",
        value: `[${song.name}](${song.url})`,
      },
      {
        name: "Autor:",
        value: `[${song.uploader.name}](${song.uploader.url})`,
      },
      {
        name: "Czas trwania:",
        value: timeValue,
      },
      {
        name: "Wyświetlenia:",
        value: `\`${song.views.toLocaleString("pl-PL")}\``,
        inline: true,
      },
      {
        name: "Łapki w górę:",
        value: `\`${song.likes.toLocaleString("pl-PL")}\``,
        inline: true,
      },
      {
        name: "Dodane przez:",
        value: `${song.user}`,
      }
    );

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

    // next song information
    const nextSong = queue.songs[1];
    if (nextSong)
      embed.addFields({
        name: "Następne w kolejce:",
        value: `[${nextSong.name}](${nextSong.url}) - \`${nextSong.formattedDuration}\``,
      });

    // define buttons
    const buttons = new discord.ActionRowBuilder()
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(3) // Success
          .setCustomId("nowplaying-pause")
          .setLabel("⏸️ | Zatrzymaj")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(3) // Success
          .setCustomId("nowplaying-skip")
          .setLabel("⏭️ | Pomiń")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(1) // Primary
          .setCustomId("nowplaying-repeat")
          .setLabel("🔁 | Zapętlanie")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(1) // Primary
          .setCustomId("nowplaying-radio")
          .setLabel("📻 | Radio")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(2) // Secondary
          .setCustomId(`nowplaying-search-${song.name.trim().substring(0, 80)}`)
          .setLabel("🔎 | Wyszukaj podobne")
      );

    // print message embed
    return msg.channel.send({ embeds: [embed], components: [buttons] });
  },
};
