import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

let skipVotes = []; // votes

export default {
  name: "skip",
  description: "Pominięcie obecnie granego utworu (głosowanie)",

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
    if (skipVotes.some((x) => x === msgInt.author.id)) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription("🗳️ | Twój głos został już zapisany!"),
        ],
        ephemeral: true,
      });
    }

    skipVotes.push(msgInt.member.user.id);
    process.setMaxListeners(Infinity);

    // translation
    let votes;
    const rest = required % 10;

    if (rest > 1 || rest < 5) votes = "głosy";
    else if (rest < 2 || rest > 4) votes = "głosów";

    let voteText, skipText; // message content define

    // interactions types description
    if (msgInt.type === 20) {
      // ChatInputCommand
      voteText = `🗳️ | Głosujesz za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`;
      skipText = "⏭️ | Pominięto utwór.";
    } else {
      // Button
      voteText = `🗳️ | ${msgInt.member.user} głosuje za **pominięciem** utworu (**${skipVotes.length}**/${required} ${votes})`;
      skipText = `⏭️ | ${msgInt.member.user} pominął/pominęła utwór.`;
    }

    // print voting message
    if (required > 1) {
      msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setDescription(voteText),
        ],
      });
    }

    // command
    if (skipVotes.length >= required) {
      // execute command
      if (queue.paused) client.distube.resume(msgInt);
      if (queue.songs.length < 2) {
        if (queue.autoplay) client.distube.skip(msgInt);
        else client.distube.stop(msgInt);
      } else client.distube.skip(msgInt);

      skipVotes = []; // reset votes

      // print message embed
      msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(skipText),
        ],
      });
    }

    // event
    client.distube.on("playSong", (queue, song) => {
      return (skipVotes = []); // reset votes
    });
  },
};
