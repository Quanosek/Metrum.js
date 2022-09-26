// import
import dotenv from "dotenv";
dotenv.config();

import "colors";
import realDate from "../functions/realDate.js";

// define module
export default {
  name: "voiceStateUpdate",

  async run(client, oldState, newState) {
    // join/leave voice channel log
    if (oldState.id === process.env.CLIENT_ID) {
      if (!oldState.channelId && newState.channelId) {
        console.log(
          realDate() +
            ` Guild: ${oldState.guild.name}, ID: ${oldState.guild.id}`.grey +
            "\n >>> Bot " +
            "joined".brightGreen +
            " the voice channel."
        );
      } else if (!newState.channelId) {
        console.log(
          realDate() +
            ` Guild: ${newState.guild.name}, ID: ${newState.guild.id}`.grey +
            "\n >>> Bot " +
            "left".brightRed +
            " the voice channel."
        );
      }
    }
  },
};
