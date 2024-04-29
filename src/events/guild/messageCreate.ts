import { type ExecException, exec } from "node:child_process";
import { join } from "node:path";
import { inspect } from "node:util";
import { ChannelTypes, type Message } from "oceanic.js";
import { _client } from "../..";
import { EmbedBuilder } from "../../builders/Embed";
import { Colors, Developers } from "../../constants";
import { trim } from "../../util/util";

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
_client.on("messageCreate", async (_message: Message) => {
  if (!(_message.inCachedGuildChannel() && _message.guild)) return;
  if (!_message.channel) return;
  if (_message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (_message.author.bot) return;

  const prefix = ">";

  if (!_message.content.startsWith(prefix)) return;
  if (!Developers.includes(_message.author.id)) return;

  const [cmd, ...args] = _message.content
    .slice(prefix.length)
    .trim()
    .split(" ");

  switch (cmd.toLocaleLowerCase()) {
    case "reload": {
      let success: boolean;

      await _client
        ._init()
        .then(() => {
          success = true;
        })
        .catch(() => {
          success = false;
        })
        .finally(async () => {
          await _client.rest.channels
            .createReaction(
              _message.channelID,
              _message.id,
              success ? ":_:1201586112083279923" : ":_:1201586248947597392"
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
        async (error: ExecException | null, result: string) => {
          if (error) {
            await _client.rest.channels.createMessage(_message.channelID, {
              embeds: new EmbedBuilder()
                .setAuthor({
                  name: _client.user.username,
                  iconURL: _client.user.avatarURL(),
                })
                .setDescription(
                  `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
                )
                .setColor(Colors.ERROR)
                .toJSONArray(),
            });
          } else {
            await _client.rest.channels.createMessage(_message.channelID, {
              embeds: new EmbedBuilder()
                .setAuthor({
                  name: _client.user.username,
                  iconURL: _client.user.avatarURL(),
                })
                .setDescription(`\`\`\`js\n${trim(result, 4000)}\`\`\``)
                .setColor(Colors.SUCCESS)
                .toJSONArray(),
            });
          }
        }
      );

      break;
    }
    case "eval": {
      const code = args.join(" ");

      if (!code) return;

      try {
        // biome-ignore lint/security/noGlobalEval:
        const result = await eval(
          `const { client } = require("../..");\n${code}`
        );
        let output = result;

        if (typeof result !== "string") {
          output = inspect(result);
        }

        await _client.rest.channels.createMessage(_message.channelID, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: _client.user.username,
              iconURL: _client.user.avatarURL(),
            })
            .setDescription(`\`\`\`js\n${trim(output, 4000)}\`\`\``)
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      } catch (error) {
        await _client.rest.channels.createMessage(_message.channelID, {
          embeds: new EmbedBuilder()
            .setAuthor({
              name: _client.user.username,
              iconURL: _client.user.avatarURL(),
            })
            .setDescription(`\`\`\`js\n${trim(String(error), 4000)}\`\`\``)
            .setColor(Colors.ERROR)
            .toJSONArray(),
        });
      }

      break;
    }
  }
});
