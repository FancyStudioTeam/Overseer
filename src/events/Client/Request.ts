import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("request", (request) => {
  logger(LoggerType.REQUEST, `[${request.method}] "${request.path}"`);
});
