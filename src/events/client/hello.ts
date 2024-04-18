import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event("hello", false, (interval: number, shard: number) => {
  logger(
    LoggerType.DEBUG,
    `[Shard ${shard}] Received hello opcode with an interval of ${interval}`
  );
});
