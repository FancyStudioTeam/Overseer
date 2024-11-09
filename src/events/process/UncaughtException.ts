import { codeBlock } from "@discordjs/formatters";
import {
  CreateLogMessageType,
  CreateWebhookMessageType,
  createLogMessage,
  createWebhookMessage,
  truncateString,
} from "@utils";

process.on("uncaughtException", (error) => {
  const message = `[Uncaught Exception] ${error.stack ?? error.message}`;
  const truncatedMessage = truncateString(message, {
    maxLength: 4000,
  });
  const fullCodeBlock = codeBlock(truncatedMessage);

  createLogMessage(message, {
    type: CreateLogMessageType.ERROR,
  });
  createWebhookMessage(fullCodeBlock, {
    type: CreateWebhookMessageType.ERROR,
  });
});
