import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event(
  "shardDisconnect",
  false,
  async (error: Error | undefined, id: number) => {
    if (error) {
      logger(
        LoggerType.ERROR,
        `[Shard ${id}] Shard has been disconnected by an error: ${
          error.stack ?? error.message
        }`
      );
    }

    logger(LoggerType.WARN, `[Shard ${id}] Shard has been disconnected`);
  }
);
