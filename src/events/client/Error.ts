import { client } from "@index";
import { CreateLogMessageType, WebhookType, createLogMessage, webhook } from "@utils";

client.on("error", (info, shard) => {
  const message = `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${typeof info === "string" ? info : (info.stack ?? info.message)}`;

  createLogMessage(message, {
    type: CreateLogMessageType.ERROR,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
