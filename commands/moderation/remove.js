// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";
import autoDelete from "../../functions/autoDelete.js";

// command module
export default {
  name: "remove",
  aliases: ["rm", "rmv"],
  description:
    "Usunięcie wybranej pozycji z kolejki utworów (domyślnie: obecnie grany)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  async run(client, prefix, msg, args) {
    // define
    let number = Number(args[0]);
    if (!args[0]) number = 1; // default value

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
    else if (isNaN(number) || number > queue.songs.length || number < 1)
      errorEmbed.setDescription("Wprowadź **poprawną** wartość!");

    if (errorEmbed.data.description) {
      msg.react("❌"), autoDelete(msg);
      return msg.channel
        .send({ embeds: [errorEmbed] })
        .then((msg) => autoDelete(msg));
    }

    msg.react("✅");

    if (number === 1) {
      // execute command
      if (queue.songs.length < 2) {
        if (queue.autoplay) client.distube.skip(msg);
        else client.distube.stop(msg);
      } else client.distube.skip(msg);

      // print message embed
      return msg.channel.send({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR1)
            .setDescription(
              "🗑️ | Usunięto **obecnie odtwarzany utwór** z kolejki."
            ),
        ],
      });
    } else {
      // execute command
      const song = queue.songs[number - 1]; // chosen song
      queue.songs.splice(number - 1, 1);

      // print message embed
      return msg.channel.send({
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
