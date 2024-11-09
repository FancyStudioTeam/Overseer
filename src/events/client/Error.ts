import { codeBlock } from "@discordjs/formatters";
import { client } from "@index";
import {
  CreateLogMessageType,
  CreateWebhookMessageType,
  createLogMessage,
  createWebhookMessage,
  truncateString,
} from "@utils";

client.on("error", (error, shard) => {
  const shardId = shard ? `[Shard ${shard}]` : "[No Shard]";
  const message = `${shardId} ${error instanceof Error ? (error.stack ?? error.message) : error}`;
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
