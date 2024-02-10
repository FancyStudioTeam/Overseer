import { Event } from "../../classes/Builders";
import { logger } from "../../util/util";

export default new Event("shardPreReady", false, async (id: number) => {
  logger(`Shard ${id} is pre-ready`);
});
