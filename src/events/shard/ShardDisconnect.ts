import { codeBlock } from "@discordjs/formatters";
import { client } from "@index";
import {
  CreateLogMessageType,
  CreateWebhookMessageType,
  createLogMessage,
  createWebhookMessage,
  truncateString,
} from "@utils";

client.on("shardDisconnect", (error, id) => {
  const message = `[Shard ${id}] ${
    error instanceof Error
      ? `Shard has been disconnected by an error: ${error.stack ?? error.message}`
      : "Shard has been disconnected"
  }`;
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
