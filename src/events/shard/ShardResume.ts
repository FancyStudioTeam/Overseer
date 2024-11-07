import { client } from "@index";
import { createLogMessage } from "@utils";

client.on("shardResume", (id) => createLogMessage(`[Shard ${id}] Shard has been resumed`));
