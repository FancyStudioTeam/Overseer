import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("debug", (info, shard) => {
  logger({
    content: `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`,
    type: LoggerType.DEBUG,
  });
});
