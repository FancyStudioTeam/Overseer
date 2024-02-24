import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event(
  "debug",
  false,
  (data: string, shard: number | undefined) => {
    logger.log(
      "DBG",
      `${shard !== undefined ? `[Shard ${shard}]` : "[No shard]"} ${data}`
    );
  }
);
