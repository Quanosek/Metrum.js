// import
import * as discord from "discord.js";

import "colors";
import fs from "fs";
import realDate from "../functions/realDate.js";

// slash commands handler
export default (client) => {
  (async () => {
    client.slashCommands = new discord.Collection();

    fs.readdirSync(`./slashCommands`).map((folder) => {
      fs.readdirSync(`./slashCommands/${folder}`).map((file) => {
        import(`../slashCommands/${folder}/${file}`).then((result) => {
          const cmd = result.default;
          // set slash commands
          try {
            if (!cmd.name) return;
            client.slashCommands.set(cmd.name, cmd);
            if (cmd.userPermissions) cmd.defaultPermission = false;
          } catch (err) {
            return console.log(
              realDate() + ` [handleSlashCommands] ${err}`.brightRed
            );
          }
        });
      });
    });
  })();
};
