import { getVoiceConnection } from "@discordjs/voice";

import ms from "ms";
import colors from "colors";

import { ErrorLog } from "../functions/errorHandler.js";
import realDate from "../functions/realDate.js";

export default {
  name: "ready",
  once: true,

  async run(client) {
    const devMode = process.argv[2] !== undefined; // npm run dev (--local)

    console.log(realDate() + " " + colors.brightYellow("Bot is ready to use!"));

    if (devMode) {
      client.user.setActivity("Aktualizacje w drodze...", { type: 3 });
      client.user.setStatus("idle");
    } else {
      client.user.setActivity();
      client.user.setStatus("online");
    }

    // auto-leave voice channels
    setInterval(() => {
      client.guilds.cache
        .map((guild) => guild.id)
        .forEach((id) => {
          if (getVoiceConnection(id) && !client.distube.getQueue(id)) {
            connection.destroy();
          }
        });
    }, ms("10m")); // delay

    const devGuild = client.guilds.cache.get(client.config.dev_guild_id);

    // register slash commands
    try {
      console.log(
        realDate() + " " + "Started refreshing application slash commands..."
      );

      if (devMode) {
        await client.application.commands.set([]); // clear global commands
        await devGuild.commands.set(client.slashCommands); // register all locally

        console.log(
          realDate() +
            " " +
            `Successfully reloaded application slash commands ${colors.brightYellow.underline(
              "locally"
            )}.`
        );
      } else {
        await devGuild.commands.set([]); // clear local commands
        await client.application.commands.set(client.slashCommands); // register all globally

        console.log(
          realDate() +
            " " +
            `Successfully reloaded application slash commands ${colors.brightYellow.underline(
              "globally"
            )}.`
        );
      }

      return;
    } catch (err) {
      return ErrorLog("onReadyRegister", err);
    }
  },
};
