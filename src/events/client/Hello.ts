import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("hello", (_interval: number, _shard: number) => {
  logger(
    LoggerType.DEBUG,
    `[Shard ${_shard}] Received hello opcode with an interval of ${_interval}`
  );
});
