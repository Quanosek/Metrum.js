// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// button module
export default {
  name: "volume",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, interaction, params) {
    // define
    const name = params[0];

    const botvoice = interaction.guild.members.me.voice.channel;
    const uservoice = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    if (!uservoice || botvoice != uservoice)
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");

    if (errorEmbed.data.description)
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });

    // buttons values
    let value = client.distube.getQueue(interaction).volume;
    if (name === "more") value = value + 5;
    if (name === "less") value = value - 5;

    if (name === "normal") {
      if (value === 50) {
        return interaction.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription(
                "🔈 | Głośność bota **jest już ustawiona** na `100%`"
              ),
          ],
          ephemeral: true,
        });
      } else {
        value = 50;
      }
    }

    // print button message
    interaction.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(
            `🔈 | ${interaction.user} zmienił **poziom głośności bota** na: \`${
              value * 2
            }%\``
          ),
      ],
    });

    // execute command
    return client.distube.setVolume(interaction, value);
  },
};
