import { type ExecException, exec } from "node:child_process";
import { codeBlock, cutText } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import type { MaybeNullish } from "#types";
import { createPrefixCommand } from "#util/Handlers";
import { errorMessage } from "#util/Util";

export default createPrefixCommand({
  name: "exec",
  run: async ({ args, context }) => {
    const command = args.join(" ");

    if (!command) {
      return await errorMessage(`**${Emojis.CIRCLE_X_COLOR} You need a command to execute**`, {
        context,
      });
    }

    return exec(`cd "${process.cwd()}" && ${command}`, async (error: MaybeNullish<ExecException>, result: string) => {
      await client.rest.channels.createMessage(context.channelID, {
        embeds: new Embed()
          .setDescription(
            codeBlock(error ? "bash" : "js", cutText(error ? error.stack ?? error.message : result, 4000)),
          )
          .setColor(error ? Colors.RED : Colors.COLOR)
          .toJSON(true),
      });
    });
  },
});
