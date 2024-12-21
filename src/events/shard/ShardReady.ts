import { client } from "@index";
import { createLogMessage } from "@utils";

client.on("shardReady", (id) => createLogMessage(`[Shard ${id}] Shard has been connected`));
