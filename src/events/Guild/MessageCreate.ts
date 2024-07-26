import { type ExecException, exec } from "node:child_process";
import { randomUUID } from "node:crypto";
import { inspect } from "node:util";
import { Result } from "@sapphire/result";
import { type Nullish, codeBlock, cutText } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import { ChannelTypes, type Message } from "oceanic.js";
import { match } from "ts-pattern";
import { Colors, Developers, Emojis } from "#constants";
import { client } from "#index";
import { prisma } from "#util/Prisma.js";

client.on("messageCreate", async (message: Message) => {
  const prefix = ">";

  if (!(message.inCachedGuildChannel() && message.guild)) return;
  if (!message.channel) return;
  if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!Developers.includes(message.author.id)) return;

  const [command, ...args] = message.content.slice(prefix.length).trim().split(" ");

  match(command.toLowerCase())
    .returnType<void>()
    .with("voucher", async () => {
      const createdClientVoucher = await prisma.clientVoucher.create({
        data: {
          voucherID: randomUUID(),
          general: {
            type: "MONTH",
          },
        },
        select: {
          voucherID: true,
        },
      });
      const dmChannel = await client.rest.users.createDM(message.author.id);

      await client.rest.channels.createMessage(dmChannel.id, {
        embeds: new Embed()
          .setDescription(`**${Emojis.CIRCLE_CHEVRON_RIGHT} ||${createdClientVoucher.voucherID}||**`)
          .setColor(Colors.COLOR)
          .toJSON(true),
      });
    })
    .with("exec", () => {
      const command = args.join(" ");

      if (!command) return;

      exec(`cd "${process.cwd()}" && ${command}`, async (error: ExecException | Nullish, result: string) => {
        await client.rest.channels.createMessage(message.channelID, {
          embeds: new Embed()
            .setDescription(
              codeBlock(error ? "bash" : "js", cutText(error ? error.stack ?? error.message : result, 4000)),
            )
            .setColor(error ? Colors.RED : Colors.COLOR)
            .toJSON(true),
        });
      });
    })
    .with("eval", async () => {
      const code = args.join(" ");

      if (!code) return;

      const result = await Result.fromAsync(async () => {
        // biome-ignore lint/security/noGlobalEval:
        const result = eval(`const { client } = require("#index");\n${code}`);
        let output = result;

        if (typeof result !== "string") {
          output = inspect(result);
        }

        await client.rest.channels.createMessage(message.channelID, {
          embeds: new Embed()
            .setDescription(codeBlock("js", cutText(output, 4000)))
            .setColor(Colors.COLOR)
            .toJSON(true),
        });
      });

      result.unwrapOrElse(async (error) => {
        await client.rest.channels.createMessage(message.channelID, {
          embeds: new Embed()
            .setDescription(codeBlock("js", cutText(String(error), 4000)))
            .setColor(Colors.RED)
            .toJSON(true),
        });
      });
    })
    .otherwise(() => undefined);
});
