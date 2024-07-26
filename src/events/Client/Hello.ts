import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("hello", (interval: number, shard: number) => {
  logger(LoggerType.DEBUG, `[Shard ${shard}] Received hello opcode with an interval of ${interval}`);
});
