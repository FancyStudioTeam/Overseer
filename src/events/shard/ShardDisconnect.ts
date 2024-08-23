import { captureException } from "@sentry/node";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardDisconnect", (error, id) => {
  if (error instanceof Error) {
    captureException(error);
    logger(`[Shard ${id}] Shard has been disconnected by an error: ${error.stack ?? error.message}`, {
      type: LoggerType.ERROR,
    });
  }

  logger(`[Shard ${id}] Shard has been disconnected`, {
    type: LoggerType.WARNING,
  });
});
