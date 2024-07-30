import { ActivityTypes } from "oceanic.js";
import { client } from "#index";
import { logger } from "#util/Util.js";

client.on("shardReady", (id) => {
  const shard = client.shards.get(id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: `Shard ${id}`,
        type: ActivityTypes.WATCHING,
      },
    ]);
  }

  logger({
    content: `[Shard ${id}] Shard has been connected`,
  });
});
