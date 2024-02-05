import dotenv from "dotenv";
dotenv.config();

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
              .setColor(process.env.COLOR_ERR)
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
              .setColor(process.env.COLOR2)
              .setTitle(`❓ | Opis komendy \`${cmd.name}\`:`)
              .setDescription(cmd.description)
              .setFooter({
                text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
              }),
          ],
        })
        .then(autoDelete(msgInt, 25));
    }

    // without arguments

    // create embed
    const embed = new discord.EmbedBuilder()
      .setColor(process.env.COLOR2)
      .setThumbnail("attachment://metrum.png")
      .setTitle(`😄 | Hej, jestem ${process.env.NAME}!`)
      .setDescription(
        `
Zaawansowany, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Jeśli chcesz się dowiedzieć o działaniu danej komendy wystarczy, że wpiszesz np. \`/help play\`, aby przeczytać opis komendy play. Więcej informacji znajdziesz na oficjalnej stronie internetowej.
        `
      )
      .setFooter({
        text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
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
    return msgInt
      .reply({
        embeds: [embed],
        components: [buttons],
        files: [
          {
            attachment: `.files/logo/${process.env.NAME}.png`,
            name: "metrum.png",
          },
        ],
      })
      .then(autoDelete(msgInt, "1m"));
  },
};
