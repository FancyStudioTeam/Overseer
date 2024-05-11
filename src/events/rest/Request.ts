import type { RawRequest } from "oceanic.js";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("request", (_request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${_request.method}] "${_request.path}"`);
});
