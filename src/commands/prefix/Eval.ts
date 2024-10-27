import { inspect } from "node:util";
import { Colors, Emojis } from "@constants";
import { bold, codeBlock } from "@discordjs/formatters";
import { Result } from "@sapphire/result";
import { createPrefixCommand } from "@util/Handlers";
import { createErrorMessage, truncateString } from "@utils";
import { Embed } from "oceanic-builders";

export default createPrefixCommand({
  developerOnly: true,
  name: "eval",
  run: async ({ args, client, context }) => {
    const code = args.join(" ");

    if (!code) {
      return await createErrorMessage(context, {
        content: bold(`${Emojis.CANCEL} You need a code to execute`),
      });
    }

    const result = Result.from<unknown, Error>(() => {
      // biome-ignore lint/security/noGlobalEval:
      const evaluationResult = eval(`const { client } = require("@index");\n${code}`);
      let output = evaluationResult;

      if (typeof evaluationResult !== "string") {
        output = inspect(evaluationResult);
      }

      return output;
    });

    if (result.isErr()) {
      return await client.rest.channels.createMessage(context.channelID, {
        embeds: new Embed()
          .setDescription(
            codeBlock(
              "js",
              truncateString(String(result.unwrapErr()), {
                maxLength: 4000,
              }),
            ),
          )
          .setColor(Colors.RED)
          .toJSON(true),
      });
    }

    return await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed()
        .setDescription(
          codeBlock(
            "js",
            truncateString(String(result.unwrap()), {
              maxLength: 4000,
            }),
          ),
        )
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
