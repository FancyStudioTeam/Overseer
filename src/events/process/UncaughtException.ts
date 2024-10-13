import { LoggerType, WebhookType, logger, webhook } from "@utils";

process.on("uncaughtException", (error) => {
  const message = `Uncaught Exception: ${error.stack ?? error.message}`;

  logger(message, {
    type: LoggerType.ERROR,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
