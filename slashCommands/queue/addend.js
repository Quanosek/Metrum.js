import discord from "discord.js";

export default {
  name: "addend",
  description: "Dodanie obecnie granego utworu jeszcze raz, na koniec kolejki",

  async run(client, msgInt) {
    // define
    let song;
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);
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
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // execute command
    return client.distube.play(uservoice, song.url, {
      member: msg.member,
      textChannel: msg.channel,
      msg,
    });
  },
};
