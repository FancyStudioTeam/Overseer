import { type ExecException, exec } from "node:child_process";
import { join } from "node:path";
import { inspect } from "node:util";
import { ChannelTypes, type Message } from "oceanic.js";
import { EmbedBuilder } from "../../builders/Embed";
import { Event } from "../../classes/Builders";
import { client } from "../../index";
import { trim } from "../../util/util";

export default new Event("messageCreate", false, async (message: Message) => {
  if (!message.guild) return;
  if (!message.channel) return;
  if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (message.author.bot) return;
  if (message.author.id !== "945029082314338407") return;

  const prefix = ">";

  if (!message.content.startsWith(prefix)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");

  switch (cmd.toLocaleLowerCase()) {
    case "reload": {
      await client
        .init()
        .then(() => {
          client.rest.channels.createReaction(
            message.channelID,
            message.id,
            ":_:1201586112083279923",
          );
        })
        .catch(() => {
          client.rest.channels.createReaction(
            message.channelID,
            message.id,
            ":_:1201586248947597392",
          );
        });

      break;
    }
    case "exec": {
      const command = args.join(" ");

      if (!command) return;

      exec(
        `cd "${join(__dirname, "../../..")}" && ${command}`,
        (error: ExecException | null, result: string) => {
          if (error) {
            return client.rest.channels.createMessage(message.channelID, {
              embeds: new EmbedBuilder()
                .setAuthor({
                  name: client.user.username,
                  iconURL: client.user.avatarURL(),
                })
                .setDescription(
                  `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``,
                )
                .setColor(client.config.colors.error)
                .toJSONArray(),
            });
          }

          return client.rest.channels.createMessage(message.channelID, {
            embeds: new EmbedBuilder()
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.avatarURL(),
              })
              .setDescription(`\`\`\`js\n${trim(result, 4000)}\`\`\``)
              .setColor(client.config.colors.success)
              .toJSONArray(),
          });
        },
      );

      break;
    }
    case "eval": {
      const code = args.join(" ");

      if (!code) return;

      try {
        const result = await eval(
          `const { client } = require("../.."); ${code}`,
        );
        let output = result;

        if (typeof result !== "string") {
          output = inspect(result);
        }

        client.rest.channels.createMessage(message.channelID, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.avatarURL(),
            })
            .setDescription(`\`\`\`js\n${trim(output, 4000)}\`\`\``)
            .setColor(client.config.colors.success)
            .toJSONArray(),
        });
      } catch (error) {
        client.rest.channels.createMessage(message.channelID, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.avatarURL(),
            })
            .setDescription(`\`\`\`js\n${trim(error as string, 4000)}\`\`\``)
            .setColor(client.config.colors.error)
            .toJSONArray(),
        });
      }

      break;
    }
  }
});
