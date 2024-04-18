import type { RawRequest } from "oceanic.js";
import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event("request", false, (request: RawRequest) => {
  logger(LoggerType.REQUEST, `[${request.method}] "${request.path}"`);
});
