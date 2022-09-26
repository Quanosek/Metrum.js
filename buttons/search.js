// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import realDate from "../functions/realDate.js";

// button module
export default {
  name: "search",

  async run(client, interaction, params) {
    // define
    const name = params[0];
    const songId = params[1];

    const botvoice = interaction.guild.members.me.voice.channel;
    const uservoice = interaction.member.voice.channel;
    const queue = client.distube.getQueue(interaction);

    const result = await client.distube.search(name);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!uservoice)
      errorEmbed.setDescription(
        "Musisz najpierw **dołączyć** na kanał głosowy!"
      );
    else if (interaction.guild.afkChannel) {
      if (uservoice.id === interaction.guild.afkChannel.id)
        errorEmbed.setDescription("Jesteś na kanale **AFK**!");
    } else if (botvoice) {
      if (botvoice.members.size === 1) {
        try {
          client.distube.voices.get(interaction).leave();
        } catch (err) {
          console.log(realDate() + ` [search button] ${err}`.brightRed);
        }
      } else if (queue && uservoice != botvoice)
        errorEmbed.setDescription(
          "Musisz być na kanale głosowym **razem ze mną**!"
        );
    } else if (
      !(
        uservoice
          .permissionsFor(interaction.guild.members.me)
          .has(discord.PermissionsBitField.Flags.ViewChannel) ||
        uservoice
          .permissionsFor(msgInt.guild.members.me)
          .has(discord.PermissionsBitField.Flags.Connect)
      )
    )
      errorEmbed.setDescription(
        "**Nie mam dostępu** do kanału głosowego, na którym jesteś!"
      );
    else if (
      !uservoice
        .permissionsFor(interaction.guild.members.me)
        .has(discord.PermissionsBitField.Flags.Speak)
    )
      errorEmbed.setDescription(
        "**Nie mam uprawnień** do aktywności głosowej na twoim kanale!"
      );

    if (errorEmbed.data.description)
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });

    // print message embed
    interaction.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(
            `
**🎵 | ${interaction.user} wybrał(a) utwór:**

**${songId}.** [${result[songId - 1].name}](${result[songId - 1].url}) - \`${
              result[songId - 1].formattedDuration
            }\`
                `
          )
          .setFooter({
            text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
          }),
      ],
    });

    // execute command
    return client.distube.play(uservoice, result[songId - 1].url, {
      interaction,
      textChannel: interaction.channel,
      member: interaction.member,
    });
  },
};
