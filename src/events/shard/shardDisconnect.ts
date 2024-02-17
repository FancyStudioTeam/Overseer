import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event(
  "shardDisconnect",
  false,
  async (error: Error | undefined, id: number) => {
    if (error) {
      logger(
        `[Shard ${id}] Shard has been disconnected by an error: ${
          error.stack ?? error.message
        }`,
        LogType.Error,
      );
    }

    logger(`[Shard ${id}] Shard has been disconnected`, LogType.Warn);
  },
);
