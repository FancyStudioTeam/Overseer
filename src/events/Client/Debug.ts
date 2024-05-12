import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("debug", (_info: string, _shard: number | undefined) => {
  logger(
    LoggerType.DEBUG,
    `${_shard !== undefined ? `[Shard ${_shard}]` : "[No shard]"} ${_info}`
  );
});
