// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

// command module
export default {
  name: "activity",
  description: "Włączanie aktywności Discord na kanale głosowym",

  options: [
    {
      name: "choice",
      description: "Wybierz aktywność",
      type: 3, // string
      required: true,
      choices: [
        // free games
        { name: "Ask Away", value: "askaway" },
        { name: "Know What I Meme", value: "meme" },
        { name: "Sketch Heads", value: "sketchheads" },
        { name: "Watch Together", value: "youtube" },
        { name: "Word Snacks", value: "wordsnack" },

        // premium games
        { name: "Blazing 8s (Requires Boost Level 1)", value: "ocho" },
        { name: "Bobble League (Requires Boost Level 1)", value: "bobble" },
        {
          name: "Checkers In The Park (Requires Boost Level 1)",
          value: "checkers",
        },
        { name: "Chess In The Park (Requires Boost Level 1)", value: "chess" },
        { name: "Land-io (Requires Boost Level 1)", value: "land" },
        { name: "Letter League (Requires Boost Level 1)", value: "lettertile" },
        { name: "Poker Night (Requires Boost Level 1)", value: "poker" },
        { name: "Putt Party (Requires Boost Level 1)", value: "puttparty" },
        { name: "SpellCast (Requires Boost Level 1)", value: "spellcast" },
      ],
    },
    {
      name: "channel",
      description: "Wybierz kanał głosowy aktywności",
      type: 7, // Channel
      channelTypes: [2], // GuildVoice
    },
  ],

  async run(client, msgInt) {
    // define
    const chosenActivity = msgInt.options.getString("choice");
    const channel = msgInt.options.getChannel("channel");
    const uservoice = msgInt.member.voice.channel;

    let chosenChannel;
    if (channel) chosenChannel = channel;
    else chosenChannel = uservoice;

    // errors
    const errorEmbed = new discord.EmbedBuilder().setColor(
      process.env.COLOR_ERR
    );

    if (!chosenChannel)
      errorEmbed.setDescription(
        "**Dołącz** na kanał głosowy lub go **wybierz**!"
      );
    else if (msgInt.guild.afkChannel) {
      if (chosenChannel.id === msgInt.guild.afkChannel.id)
        errorEmbed.setDescription("Został wybrany kanał **AFK**!");
    } else if (
      !chosenChannel
        .permissionsFor(msgInt.guild.members.me)
        .has(discord.PermissionsBitField.Flags.CreateInstantInvite)
    )
      errorEmbed.setDescription(
        `**Nie mam uprawnień** do tworzenia zaproszeń na kanał **${chosenChannel}**!`
      );

    if (errorEmbed.data.description)
      return msgInt.reply({ embeds: [errorEmbed], ephemeral: true });

    // activities list
    const allActivities = [
      // free games
      { value: "askaway", description: "Ask Away" },
      { value: "meme", description: "Know What I Meme" },
      { value: "sketchheads", description: "Sketch Heads" },
      { value: "youtube", description: "Watch Together" },
      { value: "wordsnack", description: "Word Snacks" },

      // premium games
      { value: "ocho", description: "Blazing 8s", premiumTier: 1 },
      { value: "bobble", description: "Bobble League", premiumTier: 1 },
      {
        value: "checkers",
        description: "Checkers In The Park",
        premiumTier: 1,
      },
      { value: "chess", description: "Chess In The Park", premiumTier: 1 },
      { value: "land", description: "Land-io", premiumTier: 1 },
      { value: "lettertile", description: "Letter League", premiumTier: 1 },
      { value: "poker", description: "Poker Night", premiumTier: 1 },
      { value: "puttparty", description: "Putt Party", premiumTier: 1 },
      { value: "spellcast", description: "SpellCast", premiumTier: 1 },
    ];

    const activityIndex = allActivities.indexOf(
      allActivities.find((activity) => activity.value === chosenActivity)
    );

    if (allActivities[activityIndex].premiumTier > msgInt.guild.premiumTier) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription(
              `**Poziom ulepszenia serwera jest niewystarczający** dla tej aktywności!`
            ),
        ],
        ephemeral: true,
      });
    }

    const activity = allActivities[activityIndex].description;

    // command
    client.discordTogether
      .createTogetherCode(chosenChannel.id, chosenActivity) // execute command
      .then(async (invite) => {
        // print message embed
        return msgInt.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR1)
              .setDescription(
                `[🪁 | **Dołącz** do aktywności "**${activity}**" na kanale **${chosenChannel.name}**!](${invite.code})`
              ),
          ],
        });
      });
  },
};
