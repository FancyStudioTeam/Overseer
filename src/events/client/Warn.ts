import { client } from "@index";
import { LoggerType, WebhookType, logger, webhook } from "@utils";

client.on("warn", (info, shard) => {
  const message = `${shard ? `[Shard ${shard}]` : "[No Shard]"} ${info}`;

  logger(message, {
    type: LoggerType.WARNING,
  });
  webhook(message, {
    type: WebhookType.ERROR,
  });
});
