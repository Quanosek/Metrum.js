// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "move",
  description: "Przesunięcie wybranej pozycji w kolejce utworów",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  options: [
    {
      name: "before",
      description: "Podaj numer wybranego utworu w kolejce",
      type: 10, // number
      required: true,
      minValue: 2,
    },
    {
      name: "after",
      description:
        "Podaj numer, na którą pozycję chcesz przenieść wybrany utwór",
      type: 10, // number
      required: true,
      minValue: 2,
    },
  ],

  async run(client, msgInt) {
    // define
    let before = msgInt.options.getNumber("before");
    let after = msgInt.options.getNumber("after");

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
    else if (!queue) {
      errorEmbed.setDescription("Obecnie nie jest odtwarzany **żaden utwór**!");
    } else {
      if (isNaN(before) || before > queue.songs.length)
        errorEmbed.setDescription("Wprowadź poprawny number utworu!");
      else if (isNaN(after) || after > queue.songs.length)
        errorEmbed.setDescription("Wprowadź poprawną pozycję po przesunięciu!");
      else if (before === after)
        errorEmbed.setDescription(
          "Pozycja po przesunięciu **nie może** być taka sama, jak obecna pozycja utworu w kolejce!"
        );
    }

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // execute command
    const song = queue.songs[before - 1]; // chosen song

    queue.songs.splice(before - 1, 1);
    queue.addToQueue(song, after - 1);

    // print command message
    return msgInt.reply({
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
