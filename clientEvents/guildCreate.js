import discord from "discord.js";
import colors from "colors";

import db from "../functions/database.js";
import { ErrorLog } from "../functions/errorHandler.js";
import realDate from "../functions/realDate.js";

export default {
  name: "guildCreate",

  async run(client, guild) {
    // initial
    db.create(guild.id, { prefix: client.config.bot.prefix });

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
            discord.PermissionsBitField.Flags.SendMessages,
            discord.PermissionsBitField.Flags.ViewChannel,
          ])
      )
        channelToSend = channel;
    });

    // welcome message
    if (channelToSend) {
      try {
        return channelToSend.send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.primary)
              .setThumbnail("attachment://metrum.png")
              .setTitle("😄 | Cieszę się, że tu jestem!")
              .setDescription(
                `
Dziękuję za dodanie mnie na ten serwer! Jestem ${client.config.bot.name}, czyli w pełni darmowy, polski bot muzyczny, oferujący odtwarzanie po hasłach lub bezpośrednio linków z **YouTube**, **Spotify**, **Deezer**, **SoundCloud**, oraz **800+ innych platform**, w najlepszej jakości, z możliwością szukania, tworzenia kolejek, odtwarzania transmisji na żywo czy całych playlist, auto-odtwarzania, zapętlania i dużo więcej!

Obsługuję zarówno komendy po ukośniku, jak i prefixie. Moim domyślnym prefixem jest: \`${client.config.bot.prefix}\`

Aby dowiedzieć się więcej, użyj komendy \`help\` lub odwiedź moją [stronę internetową](${client.config.website.link})!
                `
              )
              .setFooter({
                text: `Autor bota: ${client.config.author.name} (${client.config.author.nick})`,
              }),
          ],
          files: [
            {
              attachment: `images/${client.config.bot.name}.png`,
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
