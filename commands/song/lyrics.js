import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";
// command module
export default {
  name: "lyrics",
  aliases: ["ly", "l"],
  description:
    "Wyświetlenie tekstu dla obecnie odtwarzanego, lub podanego utworu",

  async run(client, prefix, msg, args) {
    // define
    let title = args.join(" ");
    const queue = client.distube.getQueue(msg);

    // no title provided
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

    // search for lyrics
    const searches = await client.Genius.songs.search(title);
    const song = searches[0];

    // no song error
    if (!song) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription("**Nie znaleziono** tekstu dla tego utworu!"),
          ],
        })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // lyrics text format
    const lyrics = await song.lyrics();

    function formattedText(value) {
      return value
        .replace(/\[.*\]\n\n\[/, "[")
        .replace(/\n\[/g, "\n\n[")
        .replace(/\n\n\n\[/g, "\n\n[")
        .replace(/\[|\]/g, "**");
    }

    const text = formattedText(lyrics).split("\n");

    let size = 0;
    let chunks = [""];

    for (let i = 0; i < text.length; i++) {
      size += text[i].length;

      if (size <= 4096) {
        chunks[chunks.length - 1] += `\n${text[i]}`;
        size++;
      } else {
        chunks.push(text[i]);
        size = text[i].length;
      }
    }

    // print lyrics embeds
    for (let i = 0; i < chunks.length; i++) {
      const isFirst = i === 0;

      //* dnia 30.07.2022 Krzysztof Olszewski zwrócił uwagę na nierozważne umiejscowienie "return", co psuło pętlę "for"
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR1)
        .setDescription(chunks[i]);

      if (isFirst) {
        embed
          .setTitle(`${song.artist.name} - ${song.title}`)
          .setURL(song.url)
          .setThumbnail(song.image);
      }

      msg.channel.send({ embeds: [embed] });
    }
  },
};
