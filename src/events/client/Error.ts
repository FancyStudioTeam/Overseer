import { client } from "@index";
import { LoggerType, WebhookType, logger, webhook } from "@utils";

client.on("error", (info, shard) => {
  const message = `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${typeof info === "string" ? info : (info.stack ?? info.message)}`;

  logger(message, {
    type: LoggerType.ERROR,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
