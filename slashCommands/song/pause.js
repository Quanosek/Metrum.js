// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "pause",
  description: "Wstrzymanie/wznowienie odtwarzania utworu",

  async run(client, msgInt) {
    // define
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

    // create message embed
    const msgEmbed = new discord.EmbedBuilder().setColor(process.env.COLOR1);

    let pauseText, resumeText; // message content define

    // interactions types description
    if (msgInt.type === 20) {
      // ChatInputCommand
      pauseText = "⏸️ | **Wstrzymano** odtwarzanie.";
      resumeText = "▶️ | **Wznowiono** odtwarzanie.";
    } else {
      // Button
      pauseText = `⏸️ | **${msgInt.member.user} wstrzymał(a)** odtwarzanie.`;
      resumeText = `▶️ | **${msgInt.member.user} wznowił(a)** odtwarzanie.`;
    }

    if (queue.playing) {
      client.distube.pause(msgInt); //execute command

      // print message embed
      msgEmbed.setDescription(pauseText);
      return msgInt.reply({ embeds: [msgEmbed] });
    }

    if (queue.paused) {
      client.distube.resume(msgInt); // execute command

      // print message embed
      msgEmbed.setDescription(resumeText);
      return msgInt.reply({ embeds: [msgEmbed] });
    }
  },
};
