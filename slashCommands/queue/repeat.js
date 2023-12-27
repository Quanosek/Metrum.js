import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

export default {
  name: "repeat",
  description: "Przełączanie trybów zapętlenia: utworu/kolejki/wyłączone",

  options: [
    {
      name: "mode",
      description: "Wybierz tryb działania zapętlenia",
      type: 10, // number
      choices: [
        { name: "song", value: 1 },
        { name: "queue", value: 2 },
        { name: "disable", value: 0 },
      ],
    },
  ],

  async run(client, msgInt) {
    // define
    let choice;
    if (msgInt.type === 20)
      // ChatInputCommand
      choice = msgInt.options.getNumber("mode");

    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

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
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // execute command
    let mode = client.distube.setRepeatMode(msgInt);

    // interactions types description
    if (msgInt.type === 20) {
      // ChatInputCommand
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
    } else {
      // Button
      mode = mode
        ? mode === 2
          ? `🔁 | ${msgInt.member.user} włączył(a) zapętlanie **kolejki**.`
          : `🔂 | ${msgInt.member.user} włączył(a) zapętlanie **utworu**.`
        : `🔁 | ${msgInt.member.user} **wyłączył(a)** zapętlanie.`;
    }

    // print message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(mode),
      ],
    });
  },
};
