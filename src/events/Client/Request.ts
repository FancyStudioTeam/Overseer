import type { RawRequest } from "oceanic.js";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("request", (request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${request.method}] "${request.path}"`);
});
