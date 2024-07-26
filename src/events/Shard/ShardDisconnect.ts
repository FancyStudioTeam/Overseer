import { captureException } from "@sentry/node";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardDisconnect", (error, id) => {
  if (error) {
    captureException(error);
    logger(LoggerType.ERROR, `[Shard ${id}] Shard has been disconnected by an error: ${error.stack ?? error.message}`);
  }

  logger(LoggerType.WARN, `[Shard ${id}] Shard has been disconnected`);
});
