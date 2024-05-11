import { captureException } from "@sentry/node";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("error", (_info: string | Error, _shard: number | undefined) => {
  captureException(_info);
  logger(
    LoggerType.WARN,
    `${_shard !== undefined ? `[Shard ${_shard}]` : "[No shard]"} ${_info}`
  );
});
