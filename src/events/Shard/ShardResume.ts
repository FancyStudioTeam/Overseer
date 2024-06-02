import { _client } from "#index";
import { LoggerType, logger } from "#util";

_client.on("shardResume", (_id: number) => {
    logger(LoggerType.INFO, `[Shard ${_id}] Shard has been resumed`);
});
