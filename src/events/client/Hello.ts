import { client } from "@index";
import { LoggerType, logger } from "@utils";

client.on("hello", (interval, shard) =>
  logger(`[Shard ${shard}] Received hello opcode with an interval of ${interval}`, {
    type: LoggerType.DEBUG,
  }),
);
