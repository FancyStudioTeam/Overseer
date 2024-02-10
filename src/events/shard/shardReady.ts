import { Event } from "../../classes/Builders";
import { logger } from "../../util/util";

export default new Event("shardReady", false, async (id: number) => {
  logger(`Shard ${id} has been connected`);
});
