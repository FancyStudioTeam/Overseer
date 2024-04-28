import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardResume", (id: number) => {
  logger(LoggerType.INFO, `[Shard ${id}] Shard has been resumed`);
});
