import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";
import ms from "ms";

export default {
  name: "seek",
  description: "Przewinięcie obecnie granego utworu do podanej wartości",

  options: [
    {
      name: "value",
      description: "Podaj czas, do którego chcesz przewinąć utwór",
      type: 3, // string
      required: true,
    },
  ],

  async run(client, msgInt) {
    // define
    let number = msgInt.options.getNumber("value");
    if (/[a-z]/.test(number)) number = ms(number) / 1000;
    else number = ms(number);

    let song;
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);
    if (queue) song = queue.songs[0]; // now playing song

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
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
          "Wprowadź **poprawną** wartość, większą od zera, ale nie większą niż długość piosenki!"
        );
      }
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // execute command
    client.distube.seek(msgInt, number);

    // print message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(
            `⏺️ | Przewinięto utwór do: \`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\``
          ),
      ],
    });
  },
};
