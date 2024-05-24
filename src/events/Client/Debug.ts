import type { Nullish } from "@sapphire/utilities";
import { _client } from "#index";
import { LoggerType, logger } from "#util";

_client.on("debug", (_info: string, _shard: number | Nullish) => {
  logger(
    LoggerType.DEBUG,
    `${_shard ? "[No Shard]" : `[Shard ${_shard}]`} ${_info}`,
  );
});
