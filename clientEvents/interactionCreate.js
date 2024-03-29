import discord from "discord.js";

import { ErrorLog, ErrorEmbed } from "../functions/errorHandler.js";

export default {
  name: "interactionCreate",

  async run(client, msgInt) {
    let element, Execute;
    msgInt.member = msgInt.guild.members.cache.get(msgInt.user.id);

    // no permissions
    if (
      !msgInt.channel
        .permissionsFor(msgInt.guild.members.me)
        .has(discord.PermissionsBitField.Flags.SendMessages)
    ) {
      return msgInt.reply({
        embeds: [
          new discord.EmbedBuilder()
            .setColor(client.config.color.error)
            .setDescription(
              "🛑 | Bot **Nie posiada uprawnień** do tworzenia wiadomości na tym kanale!"
            ),
        ],
        ephemeral: true,
      });
    }

    // slashCommand
    if (msgInt.isCommand()) {
      element = client.slashCommands.get(msgInt.commandName);
      Execute = () => element.run(client, msgInt);
    }
    // button
    if (msgInt.isButton()) {
      const [name, ...params] = msgInt.customId.split("-");
      element = client.buttons.get(name);
      Execute = () => element.run(client, msgInt, params);
    }

    // error message
    if (!element) return;
    else if (element.permissions) {
      if (!msgInt.member.permissions.has(element.permissions)) {
        return msgInt.reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(client.config.color.error)
              .setDescription(
                "🛑 | **Nie masz uprawnień** do użycia tej komendy!"
              ),
          ],
          ephemeral: true,
        });
      }
    }

    // run interaction
    try {
      await Execute();
    } catch (err) {
      try {
        return msgInt.channel.send({
          content: "",
          embeds: [ErrorEmbed(err)],
        });
      } catch (err) {
        return ErrorLog(`${element.name} interactionCreate`, err);
      }
    }
  },
};
