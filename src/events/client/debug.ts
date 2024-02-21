import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event(
  "debug",
  false,
  (data: string, shard: number | undefined) => {
    logger(
      `${shard !== undefined ? `[Shard ${shard}]` : "[No shard]"} ${data}`,
      LogType.Debug
    );
  }
);
