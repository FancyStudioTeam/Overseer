import { Result } from "@sapphire/result";
import type { Nullish } from "@sapphire/utilities";
import { _client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

_client.on("debug", (_info: string, _shard: number | Nullish) => {
  const result = Result.from(() => {
    const stringified = JSON.stringify(JSON.parse(_info), null, 2);

    logger(LoggerType.DEBUG, `${_shard ? `[Shard ${_shard}]` : "[No Shard]"} ${stringified}`);
  });

  result.unwrapOrElse(() => {
    logger(LoggerType.DEBUG, `${_shard ? `[Shard ${_shard}]` : "[No Shard]"} ${_info}`);
  });
});
