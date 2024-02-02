import { type ExecException, exec } from "node:child_process";
import { join } from "node:path";
import { inspect } from "node:util";
import { EmbedBuilder } from "@oceanicjs/builders";
import type { Message } from "oceanic.js";
import { Event } from "../../classes/Builders";
import { client } from "../../index";
import { trim } from "../../util/util";

export default new Event("messageCreate", false, async (message: Message) => {
  if (!message.guild) return;
  if (!message.channel) return;
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
          message.createReaction(":_:1201586112083279923");
        })
        .catch(() => {
          message.createReaction(":_:1201586248947597392");
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
            message.channel?.createMessage({
              embeds: new EmbedBuilder()
                .setAuthor(client.user.username, client.user.avatarURL())
                .setDescription(
                  `\`\`\`js\n${trim(error.stack as string, 4000)}\`\`\``,
                )
                .setColor(client.config.colors.error)
                .toJSON(true),
            });
          }

          message.channel?.createMessage({
            embeds: new EmbedBuilder()
              .setAuthor(client.user.username, client.user.avatarURL())
              .setDescription(`\`\`\`js\n${trim(result, 4000)}\`\`\``)
              .setColor(client.config.colors.success)
              .toJSON(true),
          });
        },
      );

      break;
    }
    case "eval": {
      const code = args.join(" ");

      if (!code) return;

      try {
        const result = await eval(code);
        let output = result;

        if (typeof result !== "string") {
          output = inspect(result);
        }

        message.channel.createMessage({
          embeds: new EmbedBuilder()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`\`\`\`js\n${trim(output, 4000)}\`\`\``)
            .setColor(client.config.colors.success)
            .toJSON(true),
        });
      } catch (error) {
        message.channel.createMessage({
          embeds: new EmbedBuilder()
            .setAuthor(client.user.username, client.user.avatarURL())
            .setDescription(`\`\`\`js\n${trim(error as string, 4000)}\`\`\``)
            .setColor(client.config.colors.error)
            .toJSON(true),
        });
      }

      break;
    }
  }
});
