import discord from "discord.js";
import fs from "fs";

import { ErrorLog } from "../functions/errorHandler.js";

export default (client) => {
  client.slashCommands = new discord.Collection();

  fs.readdirSync(`./slashCommands`).map((folder) => {
    fs.readdirSync(`./slashCommands/${folder}`).map((file) => {
      import(`../slashCommands/${folder}/${file}`).then((result) => {
        const cmd = result.default;

        // run slash commands
        try {
          client.slashCommands.set(cmd.name, cmd);
          if (cmd.userPermissions) cmd.defaultPermission = false;

          return;
        } catch (err) {
          return ErrorLog("handleSlashCommands", err);
        }
      });
    });
  });
};
