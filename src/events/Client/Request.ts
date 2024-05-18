import type { RawRequest } from "oceanic.js";
import { _client } from "../..";
import { LoggerType, logger } from "../../util/Util";

_client.on("request", (_request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${_request.method}] "${_request.path}"`);
});
