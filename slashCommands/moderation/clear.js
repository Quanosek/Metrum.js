import discord from "discord.js";

export default {
  name: "clear",
  description: "Wyczyszczenie całej kolejki (łącznie z obecnie granym utworem)",
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
    client.distube.stop(msgInt);

    // print message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.secondary)
          .setDescription("🧹 | **Wyczyszczono** kolejkę odtwarzania."),
      ],
    });
  },
};
