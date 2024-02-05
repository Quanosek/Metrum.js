import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

export default {
  name: "volume",
  description: "Zmienianie głośności bota na kanale głosowym (domyślnie: 100%)",
  permissions: [discord.PermissionsBitField.Flags.Administrator],

  options: [
    {
      name: "value",
      description: "Podaj wartość (w procentach) poziom głośności",
      type: 10, // number
      minValue: 1,
      maxValue: 200,
    },
  ],

  async run(client, msgInt) {
    // define
    const value = msgInt.options.getNumber("value") / 2;
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

    // default command menu
    if (isNaN(value) || !value) {
      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(process.env.COLOR2)
        .setTitle(`⚙️ | Ustawiona głośność: \`${queue.volume * 2}%\``)
        .setDescription(
          "Możesz ustawić poziom głośności bota w danej sesji. Podaj wartość (w procentach) w przedziale 1-200."
        );

      // define buttons
      const buttons = new discord.ActionRowBuilder()
        .addComponents(
          new discord.ButtonBuilder()
            .setStyle(1) // Primary
            .setCustomId("volume-less")
            .setLabel("-10%")
        )
        .addComponents(
          new discord.ButtonBuilder()
            .setStyle(3) // Success
            .setCustomId("volume-normal")
            .setLabel("100%")
        )
        .addComponents(
          new discord.ButtonBuilder()
            .setStyle(1) // Primary
            .setCustomId("volume-more")
            .setLabel("+10%")
        );

      // print message embed
      return msgInt.reply({ embeds: [embed], components: [buttons] });
    }

    // execute command
    client.distube.setVolume(msgInt, value);

    // print message embed
    msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setDescription(
            `🔈 | Ustawiono **poziom głośności bota** na: \`${value * 2}%\``
          ),
      ],
    });

    // event
    client.distube.on("initQueue", (queue) => {
      return (queue.volume = value);
    });
  },
};
