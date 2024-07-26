import { captureException } from "@sentry/node";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("error", (info, shard) => {
  captureException(info);
  logger(LoggerType.WARN, `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`);
});
