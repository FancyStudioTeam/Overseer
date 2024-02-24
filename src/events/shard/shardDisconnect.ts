import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event(
  "shardDisconnect",
  false,
  async (error: Error | undefined, id: number) => {
    if (error) {
      logger.log(
        "ERR",
        `[Shard ${id}] Shard has been disconnected by an error: ${
          error.stack ?? error.message
        }`
      );
    }

    logger.log("WRN", `[Shard ${id}] Shard has been disconnected`);
  }
);
