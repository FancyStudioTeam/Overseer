import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event("shardReady", false, async (id: number) => {
  logger.log("INF", `[Shard ${id}] Shard has been connected`);
});
