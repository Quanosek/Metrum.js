// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";
import db from "../../functions/database.js";

// command module
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
        process.env.COLOR_ERR
      );

      if (!newPrefix)
        errorEmbed.setDescription("⚙️ | Musisz jeszcze wpisać nowy prefix!");
      else if (newPrefix.length > 8)
        errorEmbed.setDescription(
          "⚙️ | Wybrany prefix jest zbyt długi *(max. 8 znaków)*!"
        );
      else if (args[2])
        errorEmbed.setDescription("⚙️ | W prefixie nie może być spacji!");

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
              .setColor(process.env.COLOR1)
              .setDescription(`⚙️ | Ustawiono nowy prefix: \`${newPrefix}\``),
          ],
        })
        .then((msg) => autoDelete(msg, 15));
    }

    // prefix reset command
    if (args[0] === "reset" || args[0] === "r") {
      msg.react("✅"), autoDelete(msg, 15);

      db.set.prefix(msg.guild.id, process.env.PREFIX); // change prefix

      // print message embed
      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR1)
              .setDescription(
                `⚙️ | Przywrócono domyślny prefix: \`${process.env.PREFIX}\``
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
            .setColor(process.env.COLOR2)
            .setTitle("⚙️ | Menu zmiany prefixu")
            .setDescription(
              `
Komenda pozwala na zmianę prefixu tylko dla tego serwera, w razie zapomnienia prefixu zawsze można wspomnieć bota, tzn. wpisać @${process.env.NAME}.

** ● Komendy:**
\`${prefix}prefix set <prefix>\` - ustawia nowy prefix
\`${prefix}prefix reset\` - przywraca domyślny prefix (\`${process.env.PREFIX}\`)

** ● Informacje dodatkowe:**
Wszystkie komendy obsługują również skróty np. zamiast pisać \`${prefix}prefix\`, równie dobrze możesz wpisać: \`${prefix}px\` itp..
              `
            )
            .setFooter({
              text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
            }),
        ],
      })
      .then((msg) => autoDelete(msg, "1m"));
  },
};
