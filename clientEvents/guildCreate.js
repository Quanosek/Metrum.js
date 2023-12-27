import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";

import colors from "colors";

import db from "../functions/database.js";
import { ErrorLog } from "../functions/errorHandler.js";
import realDate from "../functions/realDate.js";

export default {
  name: "guildCreate",

  async run(client, guild) {
    // initial
    db.create(guild.id, { prefix: process.env.PREFIX });

    console.log(
      realDate() +
        " " +
        colors.gray(`Guild: "${guild.name}", ID: ${guild.id}`) +
        `\n >>> Bot ${colors.brightGreen("joined")} to the server!`
    );

    // message channel
    let channelToSend;
    guild.channels.cache.forEach((channel) => {
      if (
        channel.type === 0 && // GuildText
        channel
          .permissionsFor(guild.members.me)
          .has([
            Discord.PermissionsBitField.Flags.SendMessages,
            Discord.PermissionsBitField.Flags.ViewChannel,
          ])
      )
        channelToSend = channel;
    });

    // welcome message
    if (channelToSend) {
      try {
        return channelToSend.send({
          embeds: [
            new Discord.EmbedBuilder()
              .setColor(process.env.COLOR1)
              .setThumbnail("attachment://metrum.png")
              .setTitle("😄 | Cieszę się, że tu jestem!")
              .setDescription(
                `
Dziękuję za dodanie mnie na ten serwer! Jestem ${process.env.NAME}, czyli zaawansowany, polski bot muzyczny z serii Metrum, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify** i **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Obsługuję zarówno komendy po ukośniku, jak i prefixie. Moim domyślnym prefixem jest: \`${process.env.PREFIX}\`

Aby dowiedzieć się więcej, użyj komendy \`help\` lub odwiedź moją [stronę internetową](${process.env.WEBSITE})!
                `
              )
              .setFooter({
                text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
              }),
          ],
          files: [
            {
              attachment: `.files/logo/${process.env.NAME}.png`,
              name: "metrum.png",
            },
          ],
        });
      } catch (err) {
        return ErrorLog("guildCreate", err);
      }
    }
  },
};
