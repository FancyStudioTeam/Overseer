import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardDisconnect", (error: Error | undefined, id: number) => {
  if (error) {
    logger(
      LoggerType.ERROR,
      `[Shard ${id}] Shard has been disconnected by an error: ${
        error.stack ?? error.message
      }`
    );
  }

  logger(LoggerType.WARN, `[Shard ${id}] Shard has been disconnected`);
});
