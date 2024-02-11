import "dotenv/config";
import { EmbedBuilder } from "./builders/Embed";
import { Fancycord } from "./classes/Client";
import { LogType, WebhookType } from "./types";
import { logger, trim, webhook } from "./util/util";

export const client = new Fancycord();

(async () => {
  await client.init();
  client.setMaxListeners(10);
})();

process.on("uncaughtException", (error: Error) => {
  logger(`Uncaught Exception: ${error.stack ?? error.message}`, LogType.Error);
  webhook(WebhookType.Logs, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``,
      )
      .setColor(client.config.colors.error)
      .toJSONArray(),
  });
});

process.on("unhandledRejection", (error: Error) => {
  logger(`Unhandled Rejection: ${error.stack ?? error.message}`, LogType.Error);
  webhook(WebhookType.Logs, {
    embeds: new EmbedBuilder()
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.avatarURL(),
      })
      .setDescription(
        `\`\`\`js\n${trim(error.stack ?? error.message, 4000)}\`\`\``,
      )
      .setColor(client.config.colors.error)
      .toJSONArray(),
  });
});
