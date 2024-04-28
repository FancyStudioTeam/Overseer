import { ActivityTypes } from "oceanic.js";
import { _client } from "../..";
import { version } from "../../../package.json";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

_client.on("shardReady", (id: number) => {
  const shard = _client.shards.get(id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: ".",
        state: `🍃 Shard ${shard.id} - Version ${version}`,
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  logger(LoggerType.INFO, `[Shard ${id}] Shard has been connected`);
});
