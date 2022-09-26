// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "move",
  aliases: ["mv"],
  description: "Przesunięcie wybranej pozycji w kolejce utworów",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, prefix, msg, args) {
    // define
    let before = Number(args[0]);
    let after = Number(args[1]);

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
    else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    } else {
      if (!args[0])
        errorEmbed.setDescription(
          "Musisz jeszcze wpisać numer, który utwór z kolejki chcesz przesunąć!"
        );
      else if (isNaN(before) || before > queue.songs.length || before < 1)
        errorEmbed.setDescription("Wprowadź poprawny number utworu!");
      else if (before === 1)
        errorEmbed.setDescription(
          "Nie można przesunąć obecnie granego utworu!\nWpisz wartość większą od `1`"
        );
      else if (!args[1])
        errorEmbed.setDescription(
          "Musisz jeszcze wpisać pozycję w kolejce, na którą chcesz przesunąć wybrany utwór!"
        );
      else if (isNaN(after) || after > queue.songs.length || after < 1)
        errorEmbed.setDescription("Wprowadź poprawną pozycję po przesunięciu!");
      else if (after === 1)
        errorEmbed.setDescription(
          "Nie można przesunąć przed obecnie grany utwór!\nWpisz wartość większą od `1`"
        );
      else if (before === after)
        errorEmbed.setDescription(
          "Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!"
        );
    }

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    // execute command
    const song = queue.songs[before - 1]; // chosen song

    queue.songs.splice(before - 1, 1);
    queue.addToQueue(song, after - 1);

    // print message embed
    return msg.channel.send({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR2)
          .setTitle("💿 | Zmieniono kolejność kolejki:")
          .setDescription(
            `( **${before}. ==> ${after}.** ) [${song.name}](${song.url}) - \`${song.formattedDuration}\``
          ),
      ],
    });
  },
};
