// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "watch",
  description: "Aktywność YouTube Watch Together",

  options: [
    {
      name: "channel",
      description: "Wybierz kanał głosowy aktywności",
      type: 7, // Channel
      channelTypes: [2], // GuildVoice
    },
  ],

  async run(client, msgInt) {
    // define
    const channel = msgInt.options.getChannel("channel");
    const uservoice = msgInt.member.voice.channel;

    let chosenChannel;
    if (channel) chosenChannel = channel;
    else chosenChannel = uservoice;

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!chosenChannel)
      errorEmbed.setDescription(
        "**Dołącz** na kanał głosowy lub go **wybierz**!"
      );
    else if (msgInt.guild.afkChannel) {
      if (chosenChannel.id === msgInt.guild.afkChannel.id)
        errorEmbed.setDescription("Został wybrany kanał **AFK**!");
    } else if (
      !chosenChannel
        .permissionsFor(msgInt.guild.members.me)
        .has(discord.PermissionsBitField.Flags.CreateInstantInvite)
    )
      errorEmbed.setDescription(
        `**Nie mam uprawnień** do tworzenia zaproszeń na kanał **${chosenChannel}**!`
      );

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // command
    client.discordTogether
      .createTogetherCode(chosenChannel.id, "youtube") // execute command
      .then(async (invite) => {
        // print message embed
        return msgInt.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor("#ff0000")
              .setDescription(
                `[🪁 | **Dołącz** do aktywności "**YouTube Watch Together**" na kanale **${chosenChannel.name}**!](${invite.code})`
              ),
          ],
        });
      });
  },
};
