import { LoggerType, WebhookType, logger, webhook } from "@utils";

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    const message = `Unhandled Rejection: ${error.stack ?? error.message}`;

    logger(message, {
      type: LoggerType.ERROR,
    });
    webhook(message, {
      type: WebhookType.ERROR,
    });
  }
});
