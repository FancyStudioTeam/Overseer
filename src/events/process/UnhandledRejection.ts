import { CreateLogMessageType, WebhookType, createLogMessage, webhook } from "@utils";

process.on("unhandledRejection", (error) => {
  if (error instanceof Error) {
    const message = `Unhandled Rejection: ${error.stack ?? error.message}`;

    createLogMessage(message, {
      type: CreateLogMessageType.ERROR,
    });
    webhook(message, {
      type: WebhookType.ERROR,
    });
  }
});
