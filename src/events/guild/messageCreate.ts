import { type ExecException, exec } from "node:child_process";
import { join } from "node:path";
import { inspect } from "node:util";
import { ChannelTypes, type Message } from "oceanic.js";
import { client } from "../..";
import { EmbedBuilder } from "../../builders/Embed";
import { Event } from "../../classes/Builders";
import { Colors, Developers } from "../../constants";
import { trim } from "../../util/util";

export default new Event("messageCreate", false, async (message: Message) => {
  if (!message.inCachedGuildChannel() || !message.guild) return;
  if (!message.channel) return;
  if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (message.author.bot) return;

  const prefix = ">";

  if (!message.content.startsWith(prefix)) return;
  if (!Developers.includes(message.author.id)) return;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");

  switch (cmd.toLocaleLowerCase()) {
    case "reload": {
      await client
        .init()
        .then(() => {
          client.rest.channels
            .createReaction(
              message.channelID,
              message.id,
              ":_:1201586112083279923"
            )
            .catch(() => null);
        })
        .catch(() => {
          client.rest.channels
            .createReaction(
              message.channelID,
              message.id,
              ":_:1201586248947597392"
            )
            .catch(() => null);
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
                  `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
                )
                .setColor(Colors.ERROR)
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
              .setColor(Colors.SUCCESS)
              .toJSONArray(),
          });
        }
      );

      break;
    }
    case "eval": {
      const code = args.join(" ");

      if (!code) return;

      try {
        const result = await eval(
          `const { client } = require("../..");
          (async () => {
            ${code}
          })();`
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
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      } catch (error) {
        client.rest.channels.createMessage(message.channelID, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: client.user.username,
              iconURL: client.user.avatarURL(),
            })
            .setDescription(`\`\`\`js\n${trim(<string>error, 4000)}\`\`\``)
            .setColor(Colors.ERROR)
            .toJSONArray(),
        });
      }

      break;
    }
  }
});
