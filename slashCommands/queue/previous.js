// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module

let previousVotes = []; // votes

export default {
  name: "previous",
  description: "Odtworzenie poprzednio granego utworu z kolejki (głosowanie)",

  async run(client, msgInt) {
    // define
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

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
    else if (!queue || queue.previousSongs.length < 1)
      errorEmbed.setDescription("Nie znaleziono poprzedniego utworu!");

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // voting system
    let users = uservoice.members.size;

    uservoice.members.forEach((member) => {
      if (member.user.bot) users = users - 1;
    });

    const required = Math.ceil(users / 2);

    // voting errors
    if (previousVotes.some((x) => x === msgInt.author.id)) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription("🗳️ | Twój głos został już zapisany!"),
        ],
        ephemeral: true,
      });
    }

    previousVotes.push(msgInt.author.id);
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
            .setColor(process.env.COLOR1)
            .setDescription(
              `🗳️ | Głosujesz za **odtworzeniem poprzednio granego utworu** (**${previousVotes.length}**/${required} ${votes}).`
            ),
        ],
      });
    }

    // command
    if (previousVotes.length >= required) {
      client.distube.previous(msgInt); // execute command

      previousVotes = []; // reset votes
    }

    // event
    client.distube.on("playSong", (queue, song) => {
      return (previousVotes = []); // reset votes
    });
  },
};
