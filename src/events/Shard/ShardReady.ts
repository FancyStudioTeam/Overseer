import { ActivityTypes } from "oceanic.js";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardReady", (id) => {
  const shard = client.shards.get(id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: ".",
        state: "🔗 overseerbot.pages.dev",
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  logger(LoggerType.INFO, `[Shard ${id}] Shard has been connected`);
});
