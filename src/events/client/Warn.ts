import { codeBlock } from "@discordjs/formatters";
import { client } from "@index";
import {
  CreateLogMessageType,
  CreateWebhookMessageType,
  createLogMessage,
  createWebhookMessage,
  truncateString,
} from "@utils";

client.on("warn", (info, shard) => {
  const shardId = shard ? `[Shard ${shard}]` : "[No Shard]";
  const message = `${shardId} ${info}`;
  const truncatedMessage = truncateString(message, {
    maxLength: 4000,
  });
  const fullCodeBlock = codeBlock(truncatedMessage);

  createLogMessage(message, {
    type: CreateLogMessageType.WARNING,
  });
  createWebhookMessage(fullCodeBlock, {
    type: CreateWebhookMessageType.ERROR,
  });
});
