import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("debug", (data: string, shard: number | undefined) => {
  logger(
    LoggerType.DEBUG,
    `${shard !== undefined ? `[Shard ${shard}]` : "[No shard]"} ${data}`
  );
});
