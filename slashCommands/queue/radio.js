// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "radio",
  description:
    "Auto-odtwarzanie podobnych utworów, gdy skończy się kolejka (radio utworu)",

  options: [
    {
      name: "mode",
      description: "Wybierz tryb działania radia",
      type: 10, // number
      choices: [
        { name: "enable", value: 1 },
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

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    else if (!uservoice || botvoice != uservoice)
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    else if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // execute command
    let mode = client.distube.toggleAutoplay(msgInt);

    // interactions types description
    let radioText;
    if (msgInt.type === 20) {
      // ChatInputCommand
      if (isNaN(choice)) {
        mode = mode ? "**Włączono**" : "**Wyłączono**";
      } else {
        queue.autoplay = choice;
        if (choice === 1) mode = "**Włączono**";
        if (choice === 0) mode = "**Wyłączono**";
      }

      radioText = "📻 | " + mode + " auto-odtwarzanie (radio utworu).";
    } else {
      // Button
      mode = mode ? "**włączył(a)**" : "**wyłączył(a)**";
      radioText =
        `📻 | ${msgInt.member.user} ` +
        mode +
        " auto-odtwarzanie (radio utworu).";
    }

    // print message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(radioText),
      ],
    });
  },
};
