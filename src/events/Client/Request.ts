import type { RawRequest } from "oceanic.js";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("request", (_request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${_request.method}] "${_request.path}"`);
});
