import type { Nullish } from "@sapphire/utilities";
import { captureException } from "@sentry/node";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("warn", (info: string, shard: number | Nullish) => {
  captureException(info);
  logger(LoggerType.WARN, `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`);
});
