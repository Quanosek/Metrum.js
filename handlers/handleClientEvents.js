// import
import * as discord from "discord.js";

import "colors";
import fs from "fs";
import realDate from "../functions/realDate.js";

// events handler
export default (client) => {
  (async () => {
    client.events = new discord.Collection();

    fs.readdirSync(`./clientEvents`).map((file) => {
      import(`../clientEvents/${file}`).then((result) => {
        const event = result.default;
        // run events
        try {
          if (event.once)
            client.once(event.name, (...args) => event.run(client, ...args));
          else {
            client.on(event.name, (...args) => event.run(client, ...args));
          }
        } catch (err) {
          return console.log(
            realDate() + ` [handleClientEvents] ${err}`.brightRed
          );
        }
      });
    });
  })();
};
