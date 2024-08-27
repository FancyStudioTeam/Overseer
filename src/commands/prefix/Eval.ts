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
      return await errorMessage(`**${Emojis.CANCEL} You need a code to execute**`, {
        context,
      });
    }

    const result = Result.from<unknown, Error>(() => {
      // biome-ignore lint/security/noGlobalEval:
      const evaluationResult = eval(`const { client } = require("#index");\n${code}`);
      let output = evaluationResult;

      if (typeof evaluationResult !== "string") {
        output = inspect(evaluationResult);
      }

      return output;
    });

    if (result.isErr()) {
      return await client.rest.channels.createMessage(context.channelID, {
        embeds: new Embed()
          .setDescription(codeBlock("js", cutText(String(result.unwrapErr()), 4000)))
          .setColor(Colors.RED)
          .toJSON(true),
      });
    }

    return await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed()
        .setDescription(codeBlock("js", cutText(String(result.unwrap()), 4000)))
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
