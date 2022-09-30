// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "jump",
  aliases: ["jmp", "jp", "j"],
  description: "Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, prefix, msg, args) {
    // define
    let number = Number(args[0]);
    if (!number) number = 1; // default value

    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    else if (!uservoice || botvoice != uservoice)
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    else if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    else if (isNaN(number) || number > queue.songs.length || number === 0)
      errorEmbed.setDescription("Wprowadź **poprawną** wartość!");

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    if (queue.songs.length <= 2) {
      if (queue.autoplay === true) client.distube.skip(msg);
      else client.distube.stop(msg);
    } else client.distube.jump(msg, number);

    // translation
    let songs;
    const abs = Math.abs(number);
    const rest = number % 10;

    if (abs === 1) songs = "utwór";
    else if (rest < 2 || rest > 4) songs = "utworów";
    else if (rest > 1 || rest < 5) songs = "utwory";

    // message description
    let text;
    if (number > 0) text = `⏭️ | Pominięto **${number}** ${songs}.`;
    else text = `⏮️ | Cofnięto się o **${abs}** ${songs}.`;

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR2)
          .setDescription(text),
      ],
    });
  },
};
