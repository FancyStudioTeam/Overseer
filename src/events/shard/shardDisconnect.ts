import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event(
  "shardDisconnect",
  false,
  async (error: Error | undefined, id: number) => {
    logger(
      `Shard ${id} has been disconnected ${
        `by an error: ${error?.stack}` ?? "without errors"
      }`,
      LogType.Warn,
    );
  },
);
