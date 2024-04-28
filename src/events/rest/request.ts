import type { RawRequest } from "oceanic.js";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("request", (request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${request.method}] "${request.path}"`);
});
