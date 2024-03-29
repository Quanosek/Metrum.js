import discord from "discord.js";
import ms from "ms";

export default {
  name: "forward",
  description:
    "Przewinięcie utworu do przodu o podaną wartość (domyślnie: 10 sekund)",

  options: [
    {
      name: "value",
      description: "Podaj wartość, o ile chcesz przewinąć utwór do przodu",
      type: 3, // string
    },
  ],

  async run(client, msgInt) {
    // define
    let number = msgInt.options.getString("value");
    if (!number) number = "10s"; // default value

    if (/[a-z]/.test(number)) number = ms(number) / 1000;
    else number = ms(number);

    let song;
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);
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
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // define seekTime
    let seekTime = queue.currentTime + number;
    if (seekTime < 0) seekTime = 0;
    else if (seekTime >= song.duration) seekTime = song.duration - 1;

    // execute command
    client.distube.seek(msgInt, seekTime);

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
      text = `⏩ | Przewinięto utwór o \`${number}\` ${seconds} **do przodu**`;
    else text = `⏪ | Przewinięto utwór o \`${abs}\` ${seconds} **do tyłu**`;

    // print command message
    return msgInt.reply({
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
