import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event("shardResume", false, async (id: number) => {
  logger(`Shard ${id} has been resumed`, LogType.Info);
});
