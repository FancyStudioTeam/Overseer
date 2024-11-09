import { client } from "@index";
import { CreateLogMessageType, createLogMessage } from "@utils";

client.on("debug", (info, shard) => {
  const shardId = shard ? `[Shard ${shard}]` : "[No Shard]";
  const message = `${shardId} ${info}`;

  createLogMessage(message, {
    type: CreateLogMessageType.DEBUG,
  });
});
