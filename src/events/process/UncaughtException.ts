import { EmbedBuilder } from "../../builders/Embed";
import { Colors } from "../../constants";
import { LoggerType, WebhookType } from "../../types";
import { logger, trim, webhook } from "../../util/util";

process.on("uncaughtException", async (error: Error) => {
  logger(
    LoggerType.ERROR,
    `Uncaught Exception: ${error.stack ?? error.message}`
  );
  await webhook(WebhookType.LOGS, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: "Uncaught Exception",
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
      )
      .setColor(Colors.ERROR)
      .toJSONArray(),
  });
});
