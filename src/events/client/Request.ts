import { client } from "@index";
import { LoggerType, logger } from "@utils";

client.on("request", (request) =>
  logger(`[${request.method}] "${request.path}"`, {
    type: LoggerType.REQUEST,
  }),
);
