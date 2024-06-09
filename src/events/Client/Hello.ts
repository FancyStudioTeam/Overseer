import { _client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

_client.on("hello", (_interval: number, _shard: number) => {
  logger(LoggerType.DEBUG, `[Shard ${_shard}] Received hello opcode with an interval of ${_interval}`);
});
