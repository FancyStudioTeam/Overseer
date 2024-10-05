import { client } from "@index";
import { LoggerType, logger } from "@utils";

client.on("error", (info, shard) =>
  logger(`${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`, {
    type: LoggerType.WARNING,
  }),
);
