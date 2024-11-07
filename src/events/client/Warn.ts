import { client } from "@index";
import { CreateLogMessageType, WebhookType, createLogMessage, webhook } from "@utils";

client.on("warn", (info, shard) => {
  const message = `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`;

  createLogMessage(message, {
    type: CreateLogMessageType.WARNING,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
