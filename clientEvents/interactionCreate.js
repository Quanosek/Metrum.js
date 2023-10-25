// import
import dotenv from "dotenv";
dotenv.config();

import * as discord from "discord.js";

import "colors";
import realDate from "../functions/realDate.js";

// define module
export default {
  name: "interactionCreate",

  async run(client, msgInt) {
    // define
    let element, execute;
    msgInt.member = msgInt.guild.members.cache.get(msgInt.user.id);

    // slashCommand
    if (msgInt.isCommand()) {
      element = client.slashCommands.get(msgInt.commandName);
      execute = () => element.run(client, msgInt);
    }
    // button
    if (msgInt.isButton()) {
      const [name, ...params] = msgInt.customId.split("-");
      element = client.buttons.get(name);
      execute = () => element.run(client, msgInt, params);
    }

    // error message
    if (!element) return;
    else if (element.permissions) {
      if (!msgInt.member.permissions.has(element.permissions)) {
        return msgInt.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR_ERR)
              .setDescription(
                "🛑 | **Nie masz uprawnień** do użycia tej komendy!"
              ),
          ],
          ephemeral: true,
        });
      }
    }

    // execute command
    try {
      await execute();
    } catch (err) {
      console.error(
        realDate() + ` [${element.name} interaction] ${err}`.brightRed
      );

      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(process.env.COLOR_ERR)
            .setDescription(
              "🛑 | Pojawił się błąd podczas uruchamiania komendy!"
            ),
        ],
        ephemeral: true,
      });
    }
  },
};
