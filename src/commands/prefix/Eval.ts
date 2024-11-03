import { inspect } from "node:util";
import { Colors, Emojis } from "@constants";
import { codeBlock } from "@discordjs/formatters";
import { Result } from "@sapphire/result";
import { Translations } from "@translations";
import { createPrefixCommand } from "@util/Handlers";
import { createMessage, createReaction, parseEmoji, truncateString } from "@utils";
import { ActionRow, Button, Embed } from "oceanic-builders";
import { ButtonStyles } from "oceanic.js";

const execute = async (data: string) => {
  const startWatch = process.hrtime.bigint();
  const result = Result.from<unknown, Error>(() => {
    // biome-ignore lint/security/noGlobalEval:
    const evaluationResult = eval(`const { client } = require("@index");\n${data}`);
    let output = evaluationResult;

    if (typeof evaluationResult !== "string") {
      output = inspect(evaluationResult);
    }

    return output;
  });
  const output = String(result.isOk() ? result.unwrap() : result.unwrapErr());
  const stopWatch = process.hrtime.bigint();
  const executionTime = Number(stopWatch - startWatch) / 1000000;

  return {
    output,
    took: Math.round(executionTime),
  };
};

export default createPrefixCommand({
  developerOnly: true,
  name: "eval",
  run: async ({ args, client, context, locale }) => {
    const code = args.join(" ");

    if (!code) {
      return await client.rest.channels.createReaction(context.channelID, context.id, createReaction(Emojis.CANCEL));
    }

    const { output: executionOutput, took: executionTime } = await execute(code);
    const output = truncateString(executionOutput, {
      maxLength: 4000,
    });

    return createMessage(context, {
      components: new ActionRow()
        .addComponents([
          new Button()
            .setCustomID("@eval/took")
            .setLabel(
              Translations[locale].COMMANDS.DEVELOPER.EVAL.COMPONENTS.BUTTONS.TOOK.LABEL({
                executionTime,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji(parseEmoji(Emojis.TIMER))
            .setDisabled(true),
          new Button()
            .setCustomID("@eval/delete")
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.EVAL.COMPONENTS.BUTTONS.DELETE.LABEL)
            .setStyle(ButtonStyles.DANGER)
            .setEmoji(parseEmoji(Emojis.TRASH)),
        ])
        .toJSON(true),
      embeds: new Embed().setDescription(codeBlock("ts", output)).setColor(Colors.COLOR).toJSON(true),
    });
  },
});
