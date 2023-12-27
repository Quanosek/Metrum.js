import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "repeat",
  aliases: ["rpt", "rp"],
  description: "Przełączanie trybów zapętlenia: utworu/kolejki/wyłączone",

  async run(client, prefix, msg, args) {
    // define
    let choice;
    if (args[0] === "song" || args[0] === "s") choice = 1;
    if (args[0] === "queue" || args[0] === "q") choice = 2;
    if (args[0] === "disable" || args[0] === "d") choice = 0;

    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

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
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    let mode = client.distube.setRepeatMode(msg);

    if (isNaN(choice)) {
      mode = mode
        ? mode === 2
          ? "🔁 | Włączono zapętlanie **kolejki**."
          : "🔂 | Włączono zapętlanie **utworu**."
        : "🔁 | **Wyłączono** zapętlanie.";
    } else {
      queue.repeatMode = choice;
      if (choice === 1) mode = "🔂 | Włączono zapętlanie **utworu**.";
      if (choice === 2) mode = "🔁 | Włączono zapętlanie **kolejki**.";
      if (choice === 0) mode = "🔁 | **Wyłączono** zapętlanie.";
    }

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(mode),
      ],
    });
  },
};
