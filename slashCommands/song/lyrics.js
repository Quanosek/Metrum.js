import discord from "discord.js";

export default {
  name: "lyrics",
  description:
    "Wyświetlenie tekstu dla obecnie odtwarzanego lub podanego utworu",

  options: [
    {
      name: "title",
      description: "Podaj tytuł utworu, który chcesz wyszukać",
      type: 3, // string
    },
  ],

  async run(client, msgInt) {
    // define
    let title = msgInt.options.getString("title");
    const queue = client.distube.getQueue(msgInt);

    // no title provided
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

    // search for lyrics
    const searches = await client.Genius.songs.search(title);
    const song = searches[0];

    // no song error
    if (!song) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.error)
            .setDescription("**Nie znaleziono** tekstu dla tego utworu!"),
        ],
        ephemeral: true,
      });
    }

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
        .setColor(client.config.color.primary)
        .setDescription(chunks[i]);

      if (isFirst) {
        embed
          .setTitle(`${song.artist.name} - ${song.title}`)
          .setURL(song.url)
          .setThumbnail(song.image);

        msgInt.reply({ embeds: [embed] });
      } else {
        msgInt.channel.send({ embeds: [embed] });
      }
    }
  },
};
