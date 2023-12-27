import dotenv from "dotenv";
dotenv.config();

import colors from "colors";

import realDate from "../functions/realDate.js";

export default {
  name: "voiceStateUpdate",

  // join/leave voice channel console log
  async run(client, oldState, newState) {
    if (oldState.id === process.env.CLIENT_ID) {
      if (!oldState.channelId && newState.channelId) {
        return console.log(
          realDate() +
            " " +
            colors.grey(
              `Guild: "${oldState.guild.name}", ID: ${oldState.guild.id}`
            ) +
            `\n >>> Bot ${colors.brightGreen("joined")} the voice channel.`
        );
      } else if (!newState.channelId) {
        return console.log(
          realDate() +
            " " +
            colors.grey(
              `Guild: "${newState.guild.name}", ID: ${newState.guild.id}`
            ) +
            `\n >>> Bot ${colors.brightRed("left")} the voice channel.`
        );
      }
    }

    return;
  },
};
