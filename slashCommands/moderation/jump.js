import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

export default {
  name: "jump",
  description: "Pominięcie określonej liczby utworów w kolejce (domyślnie: 1)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  options: [
    {
      name: "number",
      description: "Podaj liczbę, ile utworów chcesz pominąć",
      type: 10, // number
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
    } else if (isNaN(number) || number > queue.songs.length || number === 0) {
      errorEmbed.setDescription("Wprowadź **poprawną** wartość!");
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // execute command
    if (queue.songs.length <= 2) {
      if (queue.autoplay === true) client.distube.skip(msgInt);
      else client.distube.stop(msgInt);
    } else client.distube.jump(msgInt, number);

    // translation
    let songs;
    const abs = Math.abs(number);
    const rest = number % 10;

    if (abs === 1) songs = "utwór";
    else if (rest < 2 || rest > 4) songs = "utworów";
    else if (rest > 1 || rest < 5) songs = "utwory";

    // message description
    let text;
    if (number > 0) text = `⏭️ | Pominięto **${number}** ${songs}.`;
    else text = `⏮️ | Cofnięto się o **${fixedNumber}** ${songs}.`;

    // print message embed
    return msgInt.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setColor(process.env.COLOR2)
          .setDescription(text),
      ],
    });
  },
};
