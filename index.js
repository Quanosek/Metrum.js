import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";
import fs from "fs";
import colors from "colors";

import autoDelete from "./functions/autoDelete.js";
import { ErrorLog, ErrorEmbed } from "./functions/errorHandler.js";
import realDate from "./functions/realDate.js";

// bot starts-up
console.clear();
console.log(
  realDate() +
    " " +
    `Bot "${colors.brightYellow(process.env.NAME)}" is starting up...`
);

// define Client
const intent = discord.GatewayIntentBits;
const client = new discord.Client({
  intents: [
    intent.Guilds,
    intent.GuildMessages,
    intent.GuildVoiceStates,
    intent.MessageContent,
  ],
  shards: "auto",
  restTimeOffset: 0,
});

// handleInit
fs.readdirSync(`./handlers`).map((file) => {
  import(`./handlers/${file}`).then((result) => {
    const handler = result.default;

    // run handlers
    try {
      return handler(client);
    } catch (err) {
      return ErrorLog("handleInit", err);
    }
  });
});

// define DiscordTogether
import { DiscordTogether } from "discord-together";
client.discordTogether = new DiscordTogether(client);

// define Genius
import Genius from "genius-lyrics";
client.Genius = new Genius.Client();

// define Distube
import { DisTube } from "distube";
import { YtDlpPlugin } from "@distube/yt-dlp";

import { DeezerPlugin } from "@distube/deezer";
import { SpotifyPlugin } from "@distube/spotify";
import { SoundCloudPlugin } from "@distube/soundcloud";

client.distube = new DisTube(client, {
  plugins: [
    new YtDlpPlugin({ update: true }),

    new DeezerPlugin(),
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
  ],
  emitNewSongOnly: true,
  leaveOnStop: false,
  searchSongs: 10,
  nsfw: true,
});

client.distube.setMaxListeners(Infinity);

// handle Distube default events
client.distube
  .on("error", (channel, err) => {
    ErrorLog("Distube", err);

    return channel
      .send({
        embeds: [ErrorEmbed(err)],
      })
      .then((msg) => autoDelete(msg));
  })

  .on("addList", (queue, playlist) => {
    let tracks = `\nliczba utworów: \`${playlist.songs.length}\`\n`;
    if (playlist.source === "spotify") tracks = "";

    return queue.textChannel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setThumbnail(playlist.thumbnail)
          .setTitle(`➕ | Dodano do kolejki playlistę:`)
          .setDescription(`[${playlist.name}](${playlist.url})\n${tracks}`)
          .setFooter({
            text: "Aby dowiedzieć się więcej o obecnej kolejce użyj komendy: queue",
          }),
      ],
    });
  })

  .on("addSong", (queue, song) => {
    if (queue.songs.length < 2) return;

    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR2)
      .setThumbnail(song.thumbnail);

    if (queue.added) {
      queue.added = false;
      embed.setTitle("➕ | Dodano do kolejki jako następny:");
      embed.setDescription(
        `**2.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
      );

      if (queue.songs.length > 2)
        embed.setFooter({ text: `Utworów w kolejce: ${queue.songs.length}` });
    } else {
      embed.setTitle("➕ | Dodano do kolejki:");
      embed.setDescription(
        `**${queue.songs.length}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
      );

      if (queue.songs.length)
        embed.setFooter({
          text: "Aby dowiedzieć się więcej o obecnej kolejce użyj komendy: queue",
        });
    }

    return queue.textChannel.send({ embeds: [embed] });
  })

  .on("playSong", (queue, song) => {
    client.distube.setSelfDeaf;
    const requester = song.member.user;

    return queue.textChannel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR2)
          .setThumbnail(`${song.thumbnail}`)
          .setTitle("🎶 | Teraz odtwarzane:")
          .setDescription(
            `[${song.name}](${song.url}) - \`${song.formattedDuration}\``
          )
          .setFooter({
            text: `dodał(a): ${requester.username}`,
            iconURL: `${requester.displayAvatarURL()}`,
          }),
      ],
    });
  })

  .on("noRelated", (queue) => {
    return queue.textChannel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription("Nie znaleziono podobnych utworów."),
        ],
      })
      .then((msg) => autoDelete(msg));
  })

  .on("searchNoResult", (msg, query) => {
    return msg.channel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription(`**Brak wyników wyszukiwania** dla: \`${query}\``),
        ],
      })
      .then((msg) => autoDelete(msg));
  });

// token
client.login(process.env.TOKEN);
