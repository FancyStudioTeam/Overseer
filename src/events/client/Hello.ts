import { client } from "@index";
import { CreateLogMessageType, createLogMessage } from "@utils";

client.on("hello", (interval, shard) =>
  createLogMessage(`[Shard ${shard}] Received hello opcode with an interval of ${interval}ms`, {
    type: CreateLogMessageType.DEBUG,
  }),
);
