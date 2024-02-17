import { Event } from "../../classes/Builders";
import { logger } from "../../util/util";

export default new Event("shardReady", false, async (id: number) => {
  logger(`[Shard ${id}] Shard has been connected`);
});
