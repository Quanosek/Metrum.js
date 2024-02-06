import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

export default {
  name: "addend",
  aliases: ["ade", "ae"],
  description: "Dodanie obecnie granego utworu na koniec kolejki",

  async run(client, prefix, msg, args) {
    // define
    let song;
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);
    if (queue) song = queue.songs[0]; // now playing song

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      client.config.color.error
    );

    if (!botvoice) {
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    } else if (!uservoice || botvoice != uservoice) {
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    } else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    return client.distube.play(uservoice, song.url, {
      member: msg.member,
      textChannel: msg.channel,
      message: msg,
    });
  },
};
