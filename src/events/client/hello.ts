import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event("hello", false, (interval: number, shard: number) => {
  logger.log(
    "DBG",
    `[Shard ${shard}] Received hello opcode with an interval of ${interval}`
  );
});
