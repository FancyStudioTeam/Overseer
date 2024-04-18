import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event("shardResume", false, async (id: number) => {
  logger(LoggerType.INFO, `[Shard ${id}] Shard has been resumed`);
});
