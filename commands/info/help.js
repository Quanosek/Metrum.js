import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "help",
  aliases: ["h"],
  description:
    "Wiadomość informacyjna o bocie; Opis działania wybranej komendy (podaj nazwę lub alias)",

  async run(client, prefix, msg, args) {
    // with arguments
    if (args[0]) {
      const command = args[0].toLowerCase();

      const cmd = client.commands.find((x) => {
        return x.name.includes(command) || x.aliases.includes(command);
      });

      // command not found
      if (!cmd) {
        msg.react("❌"), autoDelete(msg);

        return msg.channel
          .send({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(client.config.color.error)
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
              .setColor(client.config.color.secondary)
              .setTitle(`❓ | Opis komendy \`${cmd.name}\`:`)
              .setDescription(cmd.description)
              .setFooter({
                text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
              }),
          ],
        })
        .then((msg) => autoDelete(msg, 25));
    }

    // without arguments
    msg.react("❓"), autoDelete(msg, "1m");

    // create embed
    const embed = new discord.EmbedBuilder()
      .setColor(client.config.color.secondary)
      .setThumbnail("attachment://metrum.png")
      .setTitle(`😄 | Hej, jestem ${client.config.bot.name}!`)
      .setDescription(
        `
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Jeśli chcesz się dowiedzieć o działaniu danej komendy wystarczy, że wpiszesz np. \`${prefix}help play\`, aby przeczytać opis komendy play. Więcej informacji znajdziesz na oficjalnej stronie internetowej.
        `
      )
      .setFooter({
        text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
      });

    // define buttons
    const buttons = new discord.ActionRowBuilder()
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(client.config.website.link)
          .setLabel("Wbijaj na stronę!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(client.config.bot.invite)
          .setLabel("Zaproś mnie na serwer!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(client.config.website.opinion)
          .setLabel("Zostaw opinię!")
      )
      .addComponents(
        new discord.ButtonBuilder()
          .setStyle(5) // Link
          .setURL(client.config.website.donate)
          .setLabel("Wesprzyj twórcę!")
      );

    // print message embed
    return msg.channel
      .send({
        embeds: [embed],
        components: [buttons],
        files: [
          {
            attachment: `images/${client.config.bot.name}.png`,
            name: "metrum.png",
          },
        ],
      })
      .then((msg) => autoDelete(msg, "1m"));
  },
};
