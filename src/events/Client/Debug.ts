import { type Nullish, isNullOrUndefined } from "@sapphire/utilities";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("debug", (_info: string, _shard: number | Nullish) => {
  logger(
    LoggerType.DEBUG,
    `${isNullOrUndefined(_shard) ? "[No Shard]" : `[Shard ${_shard}]`} ${_info}`
  );
});
