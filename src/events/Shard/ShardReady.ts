import { ActivityTypes } from "oceanic.js";
import { _client } from "#index";
import { version } from "#root/package.json";
import { LoggerType, logger } from "#util";

_client.on("shardReady", (_id: number) => {
  const shard = _client.shards.get(_id);

  if (shard) {
    shard.editStatus("online", [
      {
        name: ".",
        state: `Shard ${shard.id} | ${version}`,
        type: ActivityTypes.CUSTOM,
      },
    ]);
  }

  logger(LoggerType.INFO, `[Shard ${_id}] Shard has been connected`);
});
