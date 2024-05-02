import { ActivityTypes } from "oceanic.js";
import { _client } from "../..";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardReady", (id: number) => {
  const shard = _client.shards.get(id);

  if (shard) {
    shard.editStatus("idle", [
      {
        name: ".",
        state: `🚧 W.I.P | Shard ${shard.id}`,
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  logger(LoggerType.INFO, `[Shard ${id}] Shard has been connected`);
});
