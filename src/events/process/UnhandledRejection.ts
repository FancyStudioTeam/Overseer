import { codeBlock } from "@discordjs/formatters";
import {
  CreateLogMessageType,
  CreateWebhookMessageType,
  createLogMessage,
  createWebhookMessage,
  truncateString,
} from "@utils";

process.on("unhandledRejection", (error) => {
  const message = `[Unhandled Rejection] ${error instanceof Error ? (error.stack ?? error.message) : error}`;
  const truncatedMessage = truncateString(message, {
    maxLength: 4000,
  });
  const fullCodeBlock = codeBlock("ts", truncatedMessage);

  createLogMessage(message, {
    type: CreateLogMessageType.ERROR,
  });
  createWebhookMessage(fullCodeBlock, {
    type: CreateWebhookMessageType.ERROR,
  });
});
