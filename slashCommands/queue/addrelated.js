// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "addrelated",
  description: "Dodanie podobnego do obecnie granego utworu na koniec kolejki",

  async run(client, msgInt) {
    // define
    let song;
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);
    if (queue) song = queue.songs[0]; // now playing song

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

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // execute command
    client.distube.addRelatedSong(queue);

    // print message embed
    const relatedSong = song.related.find((song, id) => id === 0);

    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR1)
          .setThumbnail(relatedSong.thumbnail)
          .setTitle(
            "➕ | Dodano do kolejki podobny utwór do obecnie odtwarzanego:"
          )
          .setDescription(
            `**${queue.songs.length + 1}.** [${relatedSong.name}](${
              relatedSong.url
            }) - \`${relatedSong.formattedDuration}\``
          ),
      ],
    });
  },
};
