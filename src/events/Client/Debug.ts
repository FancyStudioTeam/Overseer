import type { Nullish } from "@sapphire/utilities";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("debug", (info: string, shard: number | Nullish) => {
  logger(LoggerType.DEBUG, `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`);
});
