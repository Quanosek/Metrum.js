import discord from "discord.js";
import ms from "ms";

import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "seek",
  aliases: ["sk"],
  description: "Przewinięcie obecnie granego utworu do podanej wartości",

  async run(client, prefix, msg, args) {
    // define
    let number = args.join(" ");
    if (number) {
      if (/[a-z]/.test(number)) number = ms(number) / 1000;
      else number = ms(number);
    }

    let song;
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);
    if (queue) song = queue.songs[0]; // now playing song

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      client.config.color.error
    );

    if (!botvoice) {
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    } else if (!uservoice || botvoice != uservoice) {
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    } else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    } else {
      if (song.isLive) {
        errorEmbed.setDescription(
          "**Nie można** przewijać transmisji na żywo!"
        );
      }

      if (isNaN(number) || number > queue.songs[0].duration || number < 0) {
        errorEmbed.setDescription(
          "Wprowadź **poprawną** wartość, **większą od zera**, ale nie większą niż **długość utworu**!"
        );
      }
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    client.distube.seek(msg, number);

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.primary)
          .setDescription(
            `⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\``
          ),
      ],
    });
  },
};
