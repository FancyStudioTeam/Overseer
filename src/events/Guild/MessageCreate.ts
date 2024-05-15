import { type ExecException, exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { inspect } from "node:util";
import { ClientVoucherType } from "@prisma/client";
import { codeBlock, cutText } from "@sapphire/utilities";
import { ChannelTypes, type Message } from "oceanic.js";
import { _client } from "../..";
import { EmbedBuilder } from "../../builders/Embed";
import { Colors, Developers, Emojis } from "../../constants";
import { prisma } from "../../util/prisma";

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
      await prisma.clientVoucher
        .create({
          data: {
            voucher_id: randomUUID(),
            general: {
              type:
                {
                  m: ClientVoucherType.MONTH,
                  i: ClientVoucherType.INFINITE,
                }[args[0].toLowerCase()] ?? ClientVoucherType.MONTH,
            },
          },
        })
        .then(async (createdData) => {
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
        });

      break;
    }
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
              success ? ":_:1229091468585599016" : ":_:1228660559050969229"
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
