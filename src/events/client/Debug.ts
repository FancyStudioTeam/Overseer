import { client } from "@index";
import { CreateLogMessageType, createLogMessage } from "@utils";

client.on("debug", (info, shard) =>
  createLogMessage(`${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`, {
    type: CreateLogMessageType.DEBUG,
  }),
);
