import discord from "discord.js";

export default {
  name: "forceskip",
  description: "Wymuszenie pominięcia utworu (bez głosowania)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, msgInt) {
    // define
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

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
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // execute command
    if (queue.paused) client.distube.resume(msgInt);

    if (queue.songs.length < 2) {
      if (queue.autoplay) client.distube.skip(msgInt);
      else client.distube.stop(msgInt);
    } else client.distube.skip(msgInt);

    // print command message
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.primary)
          .setDescription("⏭️ | Pominięto utwór."),
      ],
    });
  },
};
