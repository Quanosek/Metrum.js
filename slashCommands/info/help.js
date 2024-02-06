import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "help",
  description:
    "Wiadomość informacyjna o bocie; Opis działania wybranej komendy (podaj nazwę lub alias)",

  options: [
    {
      name: "command",
      description: "Podaj nazwę komendy, o której chcesz się dowiedzieć więcej",
      type: 3, // string
    },
  ],

  async run(client, msgInt) {
    const command = msgInt.options.getString("command");

    // with arguments
    if (command) {
      const cmd = client.slashCommands.find((x) => {
        return x.name.includes(command.toLowerCase());
      });

      // command not found
      if (!cmd) {
        return msgInt.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.error)
              .setDescription("**Nie znaleziono** podanej komendy!"),
          ],
          ephemeral: true,
        });
      }

      // print message embed
      return msgInt
        .reply({
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
        .then(autoDelete(msgInt, 25));
    }

    // without arguments

    // create embed
    const embed = new discord.EmbedBuilder()
      .setColor(client.config.color.secondary)
      .setThumbnail("attachment://metrum.png")
      .setTitle(`😄 | Hej, jestem ${client.config.bot.name}!`)
      .setDescription(
        `
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Jeśli chcesz się dowiedzieć o działaniu danej komendy wystarczy, że wpiszesz np. \`/help play\`, aby przeczytać opis komendy play. Więcej informacji znajdziesz na oficjalnej stronie internetowej.
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
    return msgInt
      .reply({
        embeds: [embed],
        components: [buttons],
        files: [
          {
            attachment: `images/${client.config.bot.name}.png`,
            name: "metrum.png",
          },
        ],
      })
      .then(autoDelete(msgInt, "1m"));
  },
};
