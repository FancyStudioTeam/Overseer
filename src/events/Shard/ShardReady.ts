import { ActivityTypes } from "oceanic.js";
import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.on("shardReady", (_id: number) => {
  const shard = client.shards.get(_id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: ".",
        state: "🔗 overseerbot.pages.dev",
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been connected`);
});
