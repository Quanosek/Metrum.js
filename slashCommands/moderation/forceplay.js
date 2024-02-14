import discord from "discord.js";

export default {
  name: "forceplay",
  description:
    "Wymuszenie odtworzenia podanego utworu (podaj tytuł utworu lub wklej dowolny link)",
  permissions: [discord.PermissionsBitField.Flags.ManageMessages],

  options: [
    {
      name: "song",
      description: "Podaj tytuł utworu lub wklej dowolny link",
      type: 3, // string
      required: true,
    },
  ],

  async run(client, msgInt) {
    // define
    const song = msgInt.options.getString("song");
    const botvoice = msgInt.guild.members.me.voice.channel;
    const uservoice = msgInt.member.voice.channel;
    const queue = client.distube.getQueue(msgInt);

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      client.config.color.error
    );

    if (!uservoice) {
      errorEmbed.setDescription(
        "Musisz najpierw **dołączyć** na kanał głosowy!"
      );
    } else if (uservoice.userLimit <= uservoice.members.size) {
      errorEmbed.setDescription(
        `Osiągnięto **limit użytkowników** (${uservoice.userLimit}) na kanale głosowym!`
      );
    } else if (msgInt.guild.afkChannel) {
      if (uservoice.id === msgInt.guild.afkChannel.id) {
        errorEmbed.setDescription("Jesteś na kanale **AFK**!");
      }
    } else if (botvoice) {
      if (botvoice.members.size === 1) {
        client.distube.voices.get(msgInt).leave();
      } else if (queue && uservoice != botvoice) {
        errorEmbed.setDescription(
          "Musisz być na kanale głosowym **razem ze mną**!"
        );
      }
    }

    if (errorEmbed.data.description) {
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    // print message embed
    if (
      song.includes("youtu.be/") ||
      song.includes("youtube.com/") ||
      song.includes("open.spotify.com/") ||
      song.includes("soundcloud.com/")
    ) {
      msgInt.reply(song);
    } else {
      msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.primary)
            .setDescription(
              `🔍 | **Szukam:** \`${song}\`, może to chwilę zająć...`
            ),
        ],
      });
    }

    // execute command
    return client.distube.play(uservoice, song, {
      member: msgInt.member,
      textChannel: msgInt.channel,
      skip: true,
      msgInt,
    });
  },
};
