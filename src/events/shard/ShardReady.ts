import { client } from "@index";
import { createLogMessage } from "@utils";
import { ActivityTypes } from "oceanic.js";

client.on("shardReady", (id) => {
  const shard = client.shards.get(id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: ".",
        state: "https://overseerdocs.pages.dev/",
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  createLogMessage(`[Shard ${id}] Shard has been connected`);
});
