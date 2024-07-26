import type { Nullish } from "@sapphire/utilities";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("debug", (_info: string, _shard: number | Nullish) => {
  logger(LoggerType.DEBUG, `${_shard ? `[Shard ${_shard}]` : "[No Shard]"} ${_info}`);
});
