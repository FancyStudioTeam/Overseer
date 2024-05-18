import { _client } from "../..";
import { LoggerType, logger } from "../../util/Util";

_client.on("shardResume", (_id: number) => {
  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been resumed`);
});
