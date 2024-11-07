import { CreateLogMessageType, WebhookType, createLogMessage, webhook } from "@utils";

process.on("uncaughtException", (error) => {
  const message = `Uncaught Exception: ${error.stack ?? error.message}`;

  createLogMessage(message, {
    type: CreateLogMessageType.ERROR,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
