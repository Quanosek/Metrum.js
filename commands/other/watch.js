// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "watch",
  aliases: ["w", "wt"],
  description: "Aktywność YouTube Watch Together",

  async run(client, prefix, msg, args) {
    // define
    const uservoice = msg.member.voice.channel;

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!uservoice)
      errorEmbed.setDescription(
        "Musisz najpierw **dołączyć** na kanał głosowy!"
      );
    else if (msg.guild.afkChannel) {
      if (uservoice.id === msg.guild.afkChannel.id)
        errorEmbed.setDescription("Jesteś na kanale **AFK**!");
    } else if (
      !uservoice
        .permissionsFor(msg.guild.members.me)
        .has(discord.PermissionsBitField.Flags.CreateInstantInvite)
    )
      errorEmbed.setDescription(
        `**Nie mam uprawnień** do tworzenia zaproszeń na kanał **${uservoice}**!`
      );

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    // command
    client.discordTogether
      .createTogetherCode(uservoice.id, "youtube") // execute command
      .then(async (invite) => {
        // print message embed
        return msg.channel.send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(
                `[🪁 | **Dołącz** do aktywności "**YouTube Watch Together**" na kanale **${uservoice.name}**!](${invite.code})`
              ),
          ],
        });
      });
  },
};
