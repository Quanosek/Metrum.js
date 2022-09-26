// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "resume",
  aliases: ["rs"],
  description: "Wznowienie odtwarzania utworu",

  async run(client, prefix, msg, args) {
    // define
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
    else if (queue.playing)
      errorEmbed.setDescription("Utwór **jest** już odtwarzany!");

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    if (queue.paused) {
      msg.react("✅");

      // execute command
      client.distube.resume(msg);

      // print message embed
      return msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription("▶️ | **Wznowiono** odtwarzanie."),
        ],
      });
    }
  },
};
