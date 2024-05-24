import type { RawRequest } from "oceanic.js";
import { _client } from "#index";
import { LoggerType, logger } from "#util";

_client.on("request", (_request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${_request.method}] "${_request.path}"`);
});
