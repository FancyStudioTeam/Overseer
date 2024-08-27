import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("warn", (info, shard) =>
  logger(`${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`, {
    type: LoggerType.WARNING,
  }),
);
