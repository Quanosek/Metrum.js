import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "forceleave",
  aliases: ["fl"],
  description: "Wymuszenie wyjścia z kanału głosowego",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, prefix, msg, args) {
    // define
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;

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
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅"), autoDelete(msg);

    // execute command
    client.distube.voices.get(msg).leave();

    // print message embed
    return msg.channel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.secondary)
            .setDescription("🚪 | Wyszedłem z kanału głosowego!"),
        ],
      })
      .then((msg) => autoDelete(msg));
  },
};
