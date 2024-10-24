import { type ExecException, exec } from "node:child_process";
import { Colors, Emojis } from "@constants";
import { bold, codeBlock } from "@discordjs/formatters";
import type { MaybeNullish } from "@types";
import { createPrefixCommand } from "@util/Handlers.js";
import { createErrorMessage } from "@utils";
import { Embed } from "oceanic-builders";

const truncate = (content: string, maxLength: number) =>
  content.length > maxLength ? `${content.slice(0, maxLength - 3)}...` : content;

export default createPrefixCommand({
  developerOnly: true,
  name: "exec",
  run: async ({ args, client, context }) => {
    const command = args.join(" ");

    if (!command) {
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} You need a command to execute`),
      });
    }

    return exec(`cd "${process.cwd()}" && ${command}`, async (error: MaybeNullish<ExecException>, result: string) => {
      await client.rest.channels.createMessage(context.channelID, {
        embeds: new Embed()
          .setDescription(
            codeBlock(error ? "bash" : "js", truncate(error ? (error.stack ?? error.message) : result, 4000)),
          )
          .setColor(error ? Colors.RED : Colors.COLOR)
          .toJSON(true),
      });
    });
  },
});
