import dotenv from "dotenv";
dotenv.config();

import discord from "discord.js";

import autoDelete from "../functions/autoDelete.js";
import { ErrorLog, ErrorEmbed } from "../functions/errorHandler.js";
import db from "../functions/database.js";

export default {
  name: "messageCreate",

  async run(client, msg) {
    // no permissions
    if (
      !msg.channel
        .permissionsFor(msg.guild.members.me)
        .has(discord.PermissionsBitField.Flags.SendMessages)
    ) {
      return;
    }

    // database params
    let guildDB = db.read(msg.guild.id);
    if (!guildDB) {
      guildDB = db.create(msg.guild.id, { prefix: process.env.PREFIX });
    }

    const prefix = guildDB.prefix;

    // bot mention message
    const mentionRegex = new RegExp(`^<@!?(${client.user.id})>( |)$`, "gi");
    if (msg.content.match(mentionRegex)) {
      autoDelete(msg);

      return msg
        .reply({
          embeds: [
            new discord.EmbedBuilder()
              .setColor(process.env.COLOR1)
              .setTitle("😄 | Hej, to ja!")
              .setDescription(
                `
Jestem zaawansowanym polskim botem muzycznym, obsługującym **YouTube**, **Spotify** oraz **SoundCloud**. Posiadam takie funkcje jak kolejki, radio, pauza, przewijanie i wiele więcej!

Mój prefix to \`${prefix}\`
Użyj komendy \`help\` po więcej informacji!
                `
              )
              .setFooter({
                text: `Autor bota: ${process.env.AUTHOR_NAME} (${process.env.AUTHOR_NICK})`,
              }),
          ],
        })
        .then((msg) => autoDelete(msg));
    }

    // dismiss errors
    if (
      !msg.content.toLowerCase().startsWith(prefix) ||
      !msg.guild ||
      msg.author.bot ||
      msg.channel.type === "dm"
    ) {
      return;
    }

    // format message
    const [cmdName, ...args] = msg.content
      .slice(prefix.length)
      .trim()
      .split(" ");

    // find command
    const cmd =
      client.commands.get(cmdName.toLowerCase()) ||
      client.commands.find((cmd) => {
        return cmd.aliases && cmd.aliases.includes(cmdName.toLowerCase());
      });

    // error message
    if (!cmd) return;
    if (cmd.devOnly && msg.member.user.id !== process.env.AUTHOR_ID) return;
    else if (cmd.permissions) {
      if (!msg.member.permissions.has(cmd.permissions)) {
        autoDelete(msg);

        return msg.channel
          .send({
            embeds: [
              new discord.EmbedBuilder()
                .setColor(process.env.COLOR_ERR)
                .setDescription(
                  "🛑 | **Nie masz uprawnień** do użycia tej komendy!"
                ),
            ],
          })
          .then((msg) => autoDelete(msg));
      }
    }

    // run command
    try {
      await cmd.run(client, prefix, msg, args);
    } catch (err) {
      try {
        return msg.channel.send({
          embeds: [ErrorEmbed(err)],
        });
      } catch (err) {
        return ErrorLog(`${cmd.name} messageCreate`, err);
      }
    }
  },
};
