import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

let shuffleVotes = []; // votes

export default {
  name: "shuffle",
  description: "Jednorazowe wymieszanie kolejki utworów (głosowanie)",

  async run(client, msgInt) {
    // define
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

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
    } else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // voting system
    let users = uservoice.members.size;

    uservoice.members.forEach((member) => {
      if (member.user.bot) users = users - 1;
    });

    const required = Math.ceil(users / 2);

    // voting errors
    if (shuffleVotes.some((x) => x === msgInt.author.id)) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription("🗳️ | Twój głos został już zapisany!"),
        ],
        ephemeral: true,
      });
    }

    shuffleVotes.push(msgInt.author.id);
    process.setMaxListeners(Infinity);

    // print voting message
    if (required > 1) {
      // translation
      let votes;
      const rest = required % 10;

      if (rest > 1 || rest < 5) votes = "głosy";
      else if (rest < 2 || rest > 4) votes = "głosów";

      // message
      msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setDescription(
              `🗳️ | Głosujesz za **wymieszaniem kolejki utworów** (**${shuffleVotes.length}**/${required} ${votes}).`
            ),
        ],
      });
    }

    // command
    if (shuffleVotes.length >= required) {
      client.distube.shuffle(msgInt); // execute command

      shuffleVotes = []; // reset votes

      // translation
      let songs;
      const rest = queue.songs.length % 10;

      if (queue.songs.length === 1) songs = "utwór";
      else if (rest > 1 || rest < 5) songs = "utwory";
      else if (rest < 2 || rest > 4) songs = "utworów";

      // print message embed
      msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              `🔀 | Wymieszano kolejkę zawierającą **${queue.songs.length}** ${songs}.`
            ),
        ],
      });
    }

    // event
    client.distube.on("initQueue", (queue) => {
      return (shuffleVotes = []); // reset votes
    });
  },
};
