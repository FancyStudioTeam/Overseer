import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("request", (request) => {
  logger({
    content: `[${request.method}] "${request.path}"`,
    type: LoggerType.REQUEST,
  });
});
