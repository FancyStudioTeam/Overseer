import { type ExecException, exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { inspect } from "node:util";
import { codeBlock, cutText } from "@sapphire/utilities";
import { ChannelTypes, type Message } from "oceanic.js";
import { _client } from "../..";
import { Colors, Developers, Emojis } from "../../Constants";
import { EmbedBuilder } from "../../builders/Embed";
import { prisma } from "../../util/Prisma";

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
    case "voucher": {
      let emoji = Emojis.SUCCESS;

      await prisma.clientVoucher
        .create({
          data: {
            voucher_id: randomUUID(),
            general: {
              type: "MONTH",
            },
          },
        })
        .then(async (createdData) => {
          emoji = Emojis.SUCCESS;

          await _client.rest.users
            .createDM(_message.author.id)
            .then(async (createdDM) => {
              await _client.rest.channels
                .createMessage(createdDM.id, {
                  embeds: new EmbedBuilder()
                    .setDescription(
                      `**${Emojis.RIGHT} ||${createdData.voucher_id}||**`
                    )
                    .setColor(Colors.COLOR)
                    .toJSONArray(),
                })
                .catch(() => null);
            })
            .catch(() => null);
        })
        .catch(() => {
          emoji = Emojis.MARK;
        })
        .finally(async () => {
          await _client.rest.channels
            .createReaction(
              _message.channelID,
              _message.id,
              emoji.replaceAll(/[<>]/g, "")
            )
            .catch(() => null);
        });

      break;
    }
    case "reload": {
      let emoji = Emojis.SUCCESS;

      await _client
        ._init()
        .then(() => {
          emoji = Emojis.SUCCESS;
        })
        .catch(() => {
          emoji = Emojis.MARK;
        })
        .finally(async () => {
          await _client.rest.channels
            .createReaction(
              _message.channelID,
              _message.id,
              emoji.replaceAll(/[<>]/g, "")
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
                  codeBlock("js", cutText(error.stack ?? error.message, 4000))
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
                .setDescription(codeBlock("js", cutText(result, 4000)))
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
          `const { _client } = require("../..");\n${code}`
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
            .setDescription(codeBlock("js", cutText(output, 4000)))
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
            .setDescription(codeBlock("js", cutText(String(error), 4000)))
            .setColor(Colors.ERROR)
            .toJSONArray(),
        });
      }

      break;
    }
  }
});
