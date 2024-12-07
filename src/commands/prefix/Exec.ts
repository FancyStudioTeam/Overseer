import { execSync } from "node:child_process";
import { Colors, Emojis } from "@constants";
import { codeBlock } from "@discordjs/formatters";
import { Translations } from "@translations";
import { createPrefixCommand } from "@util/Handlers";
import { createMessage, createReaction, parseEmoji, truncateString } from "@util/utils";
import { ActionRowBuilder, DangerButtonBuilder, EmbedBuilder, SecondaryButtonBuilder } from "oceanic-builders";

const execute = async (data: string) => {
  const startWatch = process.hrtime.bigint();
  const executeCommand = new Promise((resolve) => resolve(execSync(data).toString())).catch((error) => error);
  const output = String(await executeCommand);
  const stopWatch = process.hrtime.bigint();
  const executionTime = Number(stopWatch - startWatch) / 1000000;

  return {
    output,
    took: Math.round(executionTime),
  };
};

export default createPrefixCommand({
  developerOnly: true,
  name: "exec",
  run: async ({ args, client, context, locale }) => {
    const command = args.join(" ");

    if (!command) {
      return await client.rest.channels.createReaction(
        context.channelID,
        context.id,
        createReaction(Emojis.CANCEL_COLORED),
      );
    }

    const { output: executionOutput, took: executionTime } = await execute(command);
    const output = truncateString(executionOutput, {
      maxLength: 4000,
    });

    await createMessage(context, {
      components: new ActionRowBuilder()
        .addComponents([
          new SecondaryButtonBuilder()
            .setCustomID("@exec/took")
            .setLabel(
              Translations[locale].COMMANDS.DEVELOPER.EXEC.COMPONENTS.BUTTONS.TOOK.LABEL({
                executionTime,
              }),
            )
            .setEmoji(parseEmoji(Emojis.TIMER))
            .setDisabled(true),
          new DangerButtonBuilder()
            .setCustomID("@exec/delete")
            .setLabel(Translations[locale].COMMANDS.DEVELOPER.EXEC.COMPONENTS.BUTTONS.DELETE.LABEL)
            .setEmoji(parseEmoji(Emojis.TRASH_COLORED)),
        ])
        .toJSON(true),
      embeds: new EmbedBuilder().setDescription(codeBlock("ts", output)).setColor(Colors.COLOR).toJSON(true),
    });
  },
});
