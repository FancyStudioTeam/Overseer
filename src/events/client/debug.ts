import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event(
  "debug",
  false,
  (data: string, shard: number | undefined) => {
    logger(
      LoggerType.DEBUG,
      `${shard !== undefined ? `[Shard ${shard}]` : "[No shard]"} ${data}`
    );
  }
);
