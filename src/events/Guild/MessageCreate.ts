import { type ExecException, exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { inspect } from "node:util";
import { Result } from "@sapphire/result";
import { type Nullish, codeBlock, cutText } from "@sapphire/utilities";
import { ChannelTypes, type Message } from "oceanic.js";
import { match } from "ts-pattern";
import { EmbedBuilder } from "#builders";
import { Colors, Developers, Emojis } from "#constants";
import { _client } from "#index";
import { prisma } from "#prisma";

_client.on("messageCreate", async (_message: Message) => {
  const prefix = ">";

  if (!(_message.inCachedGuildChannel() && _message.guild)) return;
  if (!_message.channel) return;
  if (_message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (_message.author.bot) return;
  if (!_message.content.startsWith(prefix)) return;
  if (!Developers.includes(_message.author.id)) return;

  const [command, ...args] = _message.content.slice(prefix.length).trim().split(" ");

  match(command.toLowerCase())
    .returnType<void>()
    .with("voucher", async () => {
      const createdClientVoucher = await prisma.clientVoucher.create({
        data: {
          voucher_id: randomUUID(),
          general: {
            type: "MONTH",
          },
        },
        select: {
          voucher_id: true,
        },
      });
      const dmChannel = await _client.rest.users.createDM(_message.author.id);

      await _client.rest.channels.createMessage(dmChannel.id, {
        embeds: new EmbedBuilder()
          .setDescription(`**${Emojis.RIGHT} ||${createdClientVoucher.voucher_id}||**`)
          .setColor(Colors.COLOR)
          .toJSONArray(),
      });
    })
    .with("reload", async () => {
      await _client._init();
    })
    .with("exec", () => {
      const command = args.join(" ");

      if (!command) return;

      exec(`cd "${process.cwd()}" && ${command}`, async (error: ExecException | Nullish, result: string) => {
        await _client.rest.channels.createMessage(_message.channelID, {
          embeds: new EmbedBuilder()
            .setDescription(codeBlock(error ? "bash" : "js", cutText(error ? error.stack ?? error.message : result, 4000)))
            .setColor(error ? Colors.ERROR : Colors.COLOR)
            .toJSONArray(),
        });
      });
    })
    .with("eval", async () => {
      const code = args.join(" ");

      if (!code) return;

      const result = await Result.fromAsync(async () => {
        // biome-ignore lint/security/noGlobalEval:
        const result = eval(`const { _client } = require("#index");\n${code}`);
        let output = result;

        if (typeof result !== "string") {
          output = inspect(result);
        }

        await _client.rest.channels.createMessage(_message.channelID, {
          embeds: new EmbedBuilder()
            .setDescription(codeBlock("js", cutText(output, 4000)))
            .setColor(Colors.COLOR)
            .toJSONArray(),
        });
      });

      result.unwrapOrElse(async (error) => {
        await _client.rest.channels.createMessage(_message.channelID, {
          embeds: new EmbedBuilder()
            .setDescription(codeBlock("js", cutText(String(error), 4000)))
            .setColor(Colors.ERROR)
            .toJSONArray(),
        });
      });
    })
    .otherwise(() => null);
});
