import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

export default {
  name: "remove",
  description:
    "Usunięcie wybranej pozycji z kolejki utworów (domyślnie: obecnie grany)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  options: [
    {
      name: "number",
      description: "Podaj numer utworu w kolejce (domyślnie: obecnie grany)",
      type: 10, // number
      minValue: 1,
    },
  ],

  async run(client, msgInt) {
    // define
    let number = msgInt.options.getNumber("number");
    if (!number) number = 1; // default value

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
    } else if (isNaN(number) || number > queue.songs.length) {
      errorEmbed.setDescription("Wprowadź **poprawną** wartość!");
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    if (number === 1) {
      // execute command
      if (queue.songs.length < 2) {
        if (queue.autoplay) client.distube.skip(msgInt);
        else client.distube.stop(msgInt);
      } else client.distube.skip(msgInt);

      // print message embed
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              "🗑️ | Usunięto **obecnie odtwarzany** utwór z kolejki."
            ),
        ],
      });
    } else {
      // execute command
      const song = queue.songs[number - 1]; // chosen song
      queue.songs.splice(number - 1, 1);

      // print message embed
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR2)
            .setTitle("🗑️ | Usunięto z kolejki utworów pozycję:")
            .setDescription(
              `**${number}.** [${song.name}](${song.url}) - \`${song.formattedDuration}\``
            ),
        ],
      });
    }
  },
};
