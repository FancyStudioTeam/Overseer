import { Event } from "../../classes/Builders";
import { logger } from "../../util/util";

export default new Event("hello", false, (interval: number, shard: number) => {
  logger(
    `[Shard ${shard}] Received hello opcode with an interval of ${interval}`
  );
});
