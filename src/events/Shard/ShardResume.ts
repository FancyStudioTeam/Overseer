import { _client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

_client.on("shardResume", (_id: number) => {
  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been resumed`);
});
