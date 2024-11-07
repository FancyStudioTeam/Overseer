import { client } from "@index";
import { CreateLogMessageType, createLogMessage } from "@utils";

client.on("shardDisconnect", (error, id) => {
  if (error instanceof Error) {
    createLogMessage(`[Shard ${id}] Shard has been disconnected by an error: ${error.stack ?? error.message}`, {
      type: CreateLogMessageType.ERROR,
    });
  }

  createLogMessage(`[Shard ${id}] Shard has been disconnected`, {
    type: CreateLogMessageType.WARNING,
  });
});
