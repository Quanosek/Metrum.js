// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "help",
  aliases: ["h"],
  description:
    "Wiadomość informacyjna o bocie; Opis dla wybranej komendy (podaj nazwę lub alias)",

  async run(client, prefix, msg, args) {
    // with arguments
    if (args[0]) {
      const command = args[0].toLowerCase();

      const cmd = client.commands.find(
        (x) => x.name.includes(command) || x.aliases.includes(command)
      );

      // command not found
      if (!cmd) {
        msg.react("❌"), autoDelete(msg);

        return msg.channel
          .send({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(process.env.COLOR_ERR)
                .setDescription("**Nie znaleziono** podanej komendy!"),
            ],
          })
          .then((msg) => autoDelete(msg));
      }

      msg.react("✅"), autoDelete(msg, 25);

      // print message embed
      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR2)
              .setTitle(`❓ | Opis komendy \`${cmd.name}\`:`)
              .setDescription(cmd.description)
              .setFooter({
                text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
              }),
          ],
        })
        .then((msg) => autoDelete(msg, 25));
    }

    // without arguments
    msg.react("❓"), autoDelete(msg, "1m");

    // create embed
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR2)
      .setThumbnail("attachment://metrum.png")
      .setTitle(`😄 | Hej, jestem ${process.env.NAME}!`)
      .setDescription(
        `
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **700+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Jeśli chcesz się dowiedzieć o działaniu danej komendy wystarczy, że wpiszesz np. \`${prefix}help play\`, aby przeczytać opis komendy play. Więcej informacji znajdziesz na oficjalnej stronie internetowej.
        `
      )
      .setFooter({
        text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK}#${process.env.AUTHOR_HASH})`,
      });

    // define buttons
    const buttons = new discord.ActionRowBuilder()
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(process.env.WEBSITE)
          .setLabel("Wbijaj na stronę!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(process.env.INVITE)
          .setLabel("Zaproś mnie na serwer!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(process.env.OPINION)
          .setLabel("Zostaw opinię!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(process.env.DONATE)
          .setLabel("Wesprzyj twórcę!")
      );

    // print message embed
    return msg.channel
      .send({
        embeds: [embed],
        components: [buttons],
        files: [
          {
            attachment: `.files/logo/${process.env.NAME}.png`,
            name: "metrum.png",
          },
        ],
      })
      .then((msg) => autoDelete(msg, "1m"));
  },
};
