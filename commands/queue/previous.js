import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../../functions/autoDelete.js";

let previousVotes = []; // votes

export default {
  name: "previous",
  aliases: ["prev", "pr"],
  description: "Powrót do poprzednio granego utworu (głosowanie)",

  async run(client, prefix, msg, args) {
    // define
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice) {
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    } else if (!uservoice || botvoice != uservoice) {
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    } else if (!queue || queue.previousSongs.length < 1) {
      errorEmbed.setDescription("Nie znaleziono poprzedniego utworu!");
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);

      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    // voting system
    let users = uservoice.members.size;

    uservoice.members.forEach((member) => {
      if (member.user.bot) users = users - 1;
    });

    const required = Math.ceil(users / 2);

    // voting errors
    if (previousVotes.some((x) => x === msg.author.id)) {
      msg.react("❌"), autoDelete(msg, 5);

      return msg.channel
        .send({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription("🗳️ | Twój głos został już zapisany!"),
          ],
        })
        .then((msg) => autoDelete(msg, 5));
    }

    previousVotes.push(msg.author.id);
    process.setMaxListeners(Infinity);

    // print voting message
    if (required > 1) {
      msg.react("✅");

      // translation
      let votes;
      const rest = required % 10;

      if (rest > 1 || rest < 5) votes = "głosy";
      else if (rest < 2 || rest > 4) votes = "głosów";

      // message
      msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              `🗳️ | Głosujesz za **odtworzeniem poprzednio granego utworu** (**${previousVotes.length}**/${required} ${votes}).`
            ),
        ],
      });
    }

    // command
    if (previousVotes.length >= required) {
      msg.react("✅");

      client.distube.previous(msg); // execute command
      previousVotes = []; // reset votes
    }

    // event
    client.distube.on("playSong", (queue, song) => {
      return (previousVotes = []); // reset votes
    });
  },
};
