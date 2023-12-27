import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";
// command module
export default {
  name: "forceplay",
  aliases: ["fp"],
  description:
    "Wymuszenie puszczenia podanego utworu (podaj tytuł utworu lub wklej dowolny link)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, prefix, msg, args) {
    // define
    const song = args.join(" ");
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!song) {
      errorEmbed.setDescription(
        "Musisz jeszcze wpisać **tytuł utworu**, albo wkleić **dowolny link**!"
      );
    } else if (!uservoice) {
      errorEmbed.setDescription(
        "Musisz najpierw **dołączyć** na kanał głosowy!"
      );
    } else if (msg.guild.afkChannel) {
      if (uservoice.id === msg.guild.afkChannel.id) {
        errorEmbed.setDescription("Jesteś na kanale **AFK**!");
      }
    } else if (botvoice) {
      if (botvoice.members.size === 1) {
        client.distube.voices.get(msg).leave();
      } else if (queue && uservoice != botvoice) {
        errorEmbed.setDescription(
          "Musisz być na kanale głosowym **razem ze mną**!"
        );
      }
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // print command message
    if (
      !(
        song.includes("youtu.be/") ||
        song.includes("youtube.com/") ||
        song.includes("open.spotify.com/") ||
        song.includes("soundcloud.com/")
      )
    ) {
      msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              `🔍 | **Szukam:** \`${song}\`, może to chwilę zająć...`
            ),
        ],
      });
    }

    // execute command
    return client.distube.play(uservoice, song, {
      msg,
      textChannel: msg.channel,
      member: msg.member,
      skip: true,
    });
  },
};
