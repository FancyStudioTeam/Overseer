import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event("hello", false, (interval: number, shard: number) => {
  console.log("hello");
  logger(
    `Shard ${shard} received hello opcode with an interval of ${interval}`,
    LogType.Info,
  );
});
