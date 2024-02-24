import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event("shardResume", false, async (id: number) => {
  logger.log("INF", `[Shard ${id}] Shard has been resumed`);
});
