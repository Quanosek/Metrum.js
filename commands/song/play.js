import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "play",
  aliases: ["p"],
  description: "Odtwarzanie muzyki (podaj tytuł utworu lub wklej dowolny link)",

  async run(client, prefix, msg, args) {
    // define
    const song = args.join(" ");
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      client.config.color.error
    );

    if (!song) {
      errorEmbed.setDescription(
        "Musisz jeszcze wpisać **tytuł utworu**, albo wkleić **dowolny link**!"
      );
    } else if (!uservoice) {
      errorEmbed.setDescription(
        "Musisz najpierw **dołączyć** na kanał głosowy!"
      );
    } else if (uservoice.userLimit <= uservoice.members.size) {
      errorEmbed.setDescription(
        `Osiągnięto **limit użytkowników** (${uservoice.userLimit}) na kanale głosowym!`
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

    // print message embed
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
            .setColor(client.config.color.primary)
            .setDescription(
              `🔍 | **Szukam:** \`${song}\`, może to chwilę zająć...`
            ),
        ],
      });
    }

    // execute command
    return client.distube.play(uservoice, song, {
      member: msg.member,
      textChannel: msg.channel,
      msg,
    });
  },
};
