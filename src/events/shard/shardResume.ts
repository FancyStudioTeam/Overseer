import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardResume", (_id: number) => {
  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been resumed`);
});
