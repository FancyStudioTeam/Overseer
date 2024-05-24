import { type Nullish, isNullOrUndefined } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { _client } from "../..";
import { LoggerType, logger } from "../../util/Util";

_client.on("warn", (_info: string, _shard: number | Nullish) => {
  captureException(_info);
  logger(
    LoggerType.WARN,
    `${isNullOrUndefined(_shard) ? "[No Shard]" : `[Shard ${_shard}]`} ${_info}`,
  );
});
