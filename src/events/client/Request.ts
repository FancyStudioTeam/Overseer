import { client } from "@index";
import { CreateLogMessageType, createLogMessage } from "@utils";

client.on("request", (request) =>
  createLogMessage(`[${request.method}] "${request.path}"`, {
    type: CreateLogMessageType.REQUEST,
  }),
);
