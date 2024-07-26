import type { Nullish } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardDisconnect", (_error: Error | Nullish, _id: number) => {
  if (_error) {
    captureException(_error);
    logger(
      LoggerType.ERROR,
      `[Shard ${_id}] Shard has been disconnected by an error: ${_error.stack ?? _error.message}`,
    );
  }

  logger(LoggerType.WARN, `[Shard ${_id}] Shard has been disconnected`);
});
