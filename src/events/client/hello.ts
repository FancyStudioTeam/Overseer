import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("hello", (interval: number, shard: number) => {
  logger(
    LoggerType.DEBUG,
    `[Shard ${shard}] Received hello opcode with an interval of ${interval}`
  );
});
