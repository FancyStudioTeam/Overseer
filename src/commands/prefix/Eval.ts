import { inspect } from "node:util";
import { Colors, Emojis } from "@constants";
import { bold, codeBlock } from "@discordjs/formatters";
import { client } from "@index";
import { Result } from "@sapphire/result";
import { createPrefixCommand } from "@util/Handlers.js";
import { createErrorMessage } from "@utils";
import { Embed } from "oceanic-builders";

const truncate = (content: string, maxLength: number) =>
  content.length > maxLength ? `${content.slice(0, maxLength - 3)}...` : content;

export default createPrefixCommand({
  developerOnly: true,
  name: "eval",
  run: async ({ args, context }) => {
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
          .setDescription(codeBlock("js", truncate(String(result.unwrapErr()), 4000)))
          .setColor(Colors.RED)
          .toJSON(true),
      });
    }

    return await client.rest.channels.createMessage(context.channelID, {
      embeds: new Embed()
        .setDescription(codeBlock("js", truncate(String(result.unwrap()), 4000)))
        .setColor(Colors.COLOR)
        .toJSON(true),
    });
  },
});
