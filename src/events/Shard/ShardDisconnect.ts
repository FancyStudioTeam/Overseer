import type { Nullish } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardDisconnect", (_error: Error | Nullish, _id: number) => {
  if (_error) {
    captureException(_error);
    logger(
      LoggerType.ERROR,
      `[Shard ${_id}] Shard has been disconnected by an error: ${
        _error.stack ?? _error.message
      }`
    );
  }

  logger(LoggerType.WARN, `[Shard ${_id}] Shard has been disconnected`);
});
