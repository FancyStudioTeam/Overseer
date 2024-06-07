import type { Nullish } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { _client } from "#index";
import { LoggerType, logger } from "#util";

_client.on("error", (_info: string | Error, _shard: number | Nullish) => {
  captureException(_info);
  logger(LoggerType.WARN, `${_shard ? `[Shard ${_shard}]` : "[No Shard]"} ${_info}`);
});
