import type { RawRequest } from "oceanic.js";
import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event("request", false, (request: RawRequest) => {
  logger.log("REQ", `[${request.method}] "${request.path}"`);
});
