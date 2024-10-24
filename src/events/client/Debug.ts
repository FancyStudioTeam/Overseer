import { client } from "@index";
import { LoggerType, logger } from "@utils";

client.on("debug", (info, shard) =>
  logger(`${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`, {
    type: LoggerType.DEBUG,
  }),
);
