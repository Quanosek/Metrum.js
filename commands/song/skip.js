// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module

let skipVotes = []; // votes

export default {
  name: "skip",
  aliases: ["s"],
  description: "Pominięcie obecnie granego utworu (głosowanie)",

  async run(client, prefix, msg, args) {
    // define
    const botvoice = msg.guild.members.me.voice.channel;
    const uservoice = msg.member.voice.channel;
    const queue = client.distube.getQueue(msg);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!botvoice)
      errorEmbed.setDescription("Nie jestem na **żadnym** kanale głosowym!");
    else if (!uservoice || botvoice != uservoice)
      errorEmbed.setDescription(
        "Musisz być na kanale głosowym **razem ze mną**!"
      );
    else if (!queue)
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");

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
    if (skipVotes.some((x) => x === msg.author.id)) {
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

    skipVotes.push(msg.author.id);
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
            .setColor(process.env.COLOR2)
            .setDescription(
              `🗳️ | Głosujesz za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`
            ),
        ],
      });
    }

    // command
    if (skipVotes.length >= required) {
      msg.react("✅");

      // execute command
      if (queue.paused) client.distube.resume(msg);
      if (queue.songs.length < 2) {
        if (queue.autoplay) client.distube.skip(msg);
        else client.distube.stop(msg);
      } else client.distube.skip(msg);

      skipVotes = []; // reset votes

      // print message embed
      msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription("⏭️ | Pominięto utwór."),
        ],
      });
    }

    // event
    client.distube.on("playSong", (queue, song) => {
      return (skipVotes = []); // reset votes
    });
  },
};
