import Discord from "discord.js";

import fs from "fs";

import { ErrorLog } from "../functions/errorHandler.js";

export default (client) => {
  client.events = new Discord.Collection();

  fs.readdirSync(`./clientEvents`).map((file) => {
    import(`../clientEvents/${file}`).then((result) => {
      const event = result.default;

      // run events
      try {
        if (event.once) {
          client.once(event.name, (...args) => event.run(client, ...args));
        } else {
          client.on(event.name, (...args) => event.run(client, ...args));
        }

        return;
      } catch (err) {
        return ErrorLog("handleClientEvents", err);
      }
    });
  });
};
