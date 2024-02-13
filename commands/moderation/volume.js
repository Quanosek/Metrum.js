import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "volume",
  aliases: ["v"],
  description: "Zmiana głośności bota na kanale głosowym (domyślnie: 100%)",
  permissions: [discord.PermissionsBitField.Flags.Administrator],

  async run(client, prefix, msg, args) {
    // define
    const value = Number(args[0]) / 2;
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

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
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    // default command menu
    if (isNaN(value) || !value) {
      msg.react("🔈");

      // create message embed
      const embed = new discord.EmbedBuilder()
        .setColor(client.config.color.secondary)
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
      return msg.channel.send({ embeds: [embed], components: [buttons] });
    }

    // wrong volume value error
    if (value < 0.5 || value > 100) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.error)
              .setDescription(
                `🔈 | Podano **niepoprawną wartość** *(w procentach)* poziomu głośności (\`1-200\`)!`
              ),
          ],
        })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    client.distube.setVolume(msg, value);

    // print message embed
    msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(client.config.color.primary)
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
