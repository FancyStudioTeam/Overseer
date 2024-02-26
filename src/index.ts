import "dotenv/config";
import { EmbedBuilder } from "./builders/Embed";
import { Fancycord } from "./classes/Client";
import { WebhookType } from "./types";
import { logger } from "./util/logger";
import { trim, webhook } from "./util/util";

export const client = new Fancycord();

(async () => {
  await client.init();
  client.setMaxListeners(10);
})();

process.on("uncaughtException", (error: Error) => {
  logger.log("ERR", `Uncaught Exception: ${error.stack ?? error.message}`);
  webhook(WebhookType.LOGS, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
      )
      .setColor(client.config.colors.error)
      .toJSONArray(),
  });
});

process.on("unhandledRejection", (error: Error) => {
  logger.log("ERR", `Unhandled Rejection: ${error.stack ?? error.message}`);
  webhook(WebhookType.LOGS, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``
      )
      .setColor(client.config.colors.error)
      .toJSONArray(),
  });
});
