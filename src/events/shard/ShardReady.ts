import { client } from "@index";
import { logger } from "@utils";

client.on("shardReady", (id) => logger(`[Shard ${id}] Shard has been connected`));
