import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";
import db from "../../functions/database.js";

export default {
  name: "prefix",
  aliases: ["pref", "pf", "px"],
  description: "Zmiana prefixu bota",
  permissions: ["ADMINISTRATOR"],

  async run(client, prefix, msg, args) {
    // prefix set command
    if (args[0] === "set" || args[0] === "s") {
      const newPrefix = args[1];

      // errors
      const errorEmbed = new discord.EmbedBuilder().setColor(
        client.config.color.error
      );

      if (!newPrefix) {
        errorEmbed.setDescription("⚙️ | Musisz jeszcze wpisać nowy prefix!");
      } else if (newPrefix.length > 8) {
        errorEmbed.setDescription(
          "⚙️ | Wybrany prefix jest zbyt długi *(max. 8 znaków)*!"
        );
      } else if (args[2]) {
        errorEmbed.setDescription("⚙️ | W prefixie nie może być spacji!");
      }

      if (errorEmbed.data.description) {
        msg.react("❌"), autoDelete(msg);

        return msg.channel
          .send({ embeds: [errorEmbed] })
          .then((msg) => autoDelete(msg));
      }

      // command
      msg.react("✅"), autoDelete(msg, 15);

      db.set.prefix(msg.guild.id, newPrefix); // change prefix

      // print message embed
      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.primary)
              .setDescription(`⚙️ | Ustawiono nowy prefix: \`${newPrefix}\``),
          ],
        })
        .then((msg) => autoDelete(msg, 15));
    }

    // prefix reset command
    if (args[0] === "reset" || args[0] === "r") {
      msg.react("✅"), autoDelete(msg, 15);

      db.set.prefix(msg.guild.id, client.config.bot.prefix); // change prefix

      // print message embed
      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.primary)
              .setDescription(
                `⚙️ | Przywrócono domyślny prefix: \`${client.config.bot.prefix}\``
              ),
          ],
        })
        .then((msg) => autoDelete(msg, 15));
    }

    // prefix help menu
    msg.react("❓"), autoDelete(msg, "1m");

    // print message embed
    return msg.channel
      .send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.secondary)
            .setTitle("⚙️ | Menu zmiany prefixu")
            .setDescription(
              `
Komenda pozwala na zmianę prefixu tylko dla tego serwera, w razie zapomnienia prefixu zawsze można wspomnieć bota, tzn. wpisać @${client.config.bot.name}.

** ● Komendy:**
\`${prefix}prefix set <prefix>\` - ustawia nowy prefix
\`${prefix}prefix reset\` - przywraca domyślny prefix (\`${client.config.bot.prefix}\`)

** ● Informacje dodatkowe:**
Wszystkie komendy obsługują również skróty np. zamiast pisać \`${prefix}prefix\`, równie dobrze możesz wpisać: \`${prefix}px\` itp..
              `
            )
            .setFooter({
              text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
            }),
        ],
      })
      .then((msg) => autoDelete(msg, "1m"));
  },
};
