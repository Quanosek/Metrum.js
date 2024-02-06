import discord from "discord.js";
import ms from "ms";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "rewind",
  aliases: ["rw"],
  description:
    "Przewinięcie utworu do tyłu o podaną wartość (domyślnie: 10 sekund)",

  async run(client, prefix, msg, args) {
    // define
    let number = args.join(" ");
    if (!number) number = "10s"; // default value

    if (/[a-z]/.test(number)) number = ms(number) / 1000;
    else number = ms(number);

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

      if (isNaN(number) || number === 0) {
        errorEmbed.setDescription(
          "Wprowadź **poprawną** wartość, **różną od zera**!"
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

    // define seekTime
    let seekTime = queue.currentTime - number;
    if (seekTime < 0) seekTime = 0;
    else if (seekTime >= song.duration) seekTime = song.duration - 1;

    // execute command
    client.distube.seek(msg, seekTime);

    // translation
    let seconds;
    const abs = Math.abs(number);
    const rest = number % 10;

    if (abs === 1) seconds = "sekundę";
    else if (rest < 2 || rest > 4) seconds = "sekund";
    else if (rest > 1 || rest < 5) seconds = "sekundy";

    // message description
    let text;
    if (number > 0)
      text = `⏪ | Przewinięto utwór o \`${number}\` ${seconds} **do tyłu**`;
    else text = `⏩ | Przewinięto utwór o \`${abs}\` ${seconds} **do przodu**`;

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.primary)
          .setDescription(
            text +
              ` (\`${queue.formattedCurrentTime}\`/\`${song.formattedDuration}\`).`
          ),
      ],
    });
  },
};
