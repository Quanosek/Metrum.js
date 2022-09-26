// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "radio",
  aliases: ["r"],
  description:
    "Auto-odtwarzanie podobnych utworów, gdy skończy się kolejka (radio utworu)",

  async run(client, prefix, msg, args) {
    // define
    let choice;
    if (args[0] === "enable" || args[0] === "e") choice = 1;
    if (args[0] === "disable" || args[0] === "d") choice = 0;

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

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    let mode = client.distube.toggleAutoplay(msg);

    if (isNaN(choice)) {
      mode = mode ? "**Włączono**" : "**Wyłączono**";
    } else {
      queue.autoplay = choice;
      if (choice === 1) mode = "**Włączono**";
      if (choice === 0) mode = "**Wyłączono**";
    }

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription("📻 | " + mode + " auto-odtwarzanie (radio utworu)."),
      ],
    });
  },
};
