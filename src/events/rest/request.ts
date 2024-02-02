import type { RawRequest } from "oceanic.js";
import { Event } from "../../classes/Builders";
import { LogType } from "../../types";
import { logger } from "../../util/util";

export default new Event("request", false, (request: RawRequest) => {
  logger(`[${request.method}] "${request.path}"`, LogType.Request);
});
