import { inspect } from "node:util";
import { Result } from "@sapphire/result";
import { codeBlock, cutText } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import { Colors, Emojis } from "#constants";
import { client } from "#index";
import { createPrefixCommand } from "#util/Handlers";
import { errorMessage } from "#util/Util";

export default createPrefixCommand({
  name: "eval",
  run: async ({ args, context }) => {
    const code = args.join(" ");

    if (!code) {
      return await errorMessage(`**${Emojis.CIRCLE_X_COLOR} You need a code to execute**`, { context });
    }

    const result = Result.from<unknown, Error>(() => {
      // biome-ignore lint/security/noGlobalEval:
      const result = eval(`const { client } = require("#index");\n${code}`);
      let output = result;

      if (typeof result !== "string") {
        output = inspect(result);
      }

      return output;
    });

    if (result.isErr()) {
      const error = result.unwrapErr();

      return await client.rest.channels.createMessage(context.channelID, {
        embeds: new Embed()
          .setDescription(codeBlock("js", cutText(String(error), 4000)))
          .setColor(Colors.RED)
          .toJSON(true),
      });
    }

    const output = result.unwrap();

    return await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed()
        .setDescription(codeBlock("js", cutText(String(output), 4000)))
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
