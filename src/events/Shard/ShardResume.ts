import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardResume", (_id: number) => {
  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been resumed`);
});
