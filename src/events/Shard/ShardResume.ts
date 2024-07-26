import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardResume", (id: number) => {
  logger(LoggerType.INFO, `[Shard ${id}] Shard has been resumed`);
});
