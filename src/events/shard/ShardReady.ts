import { client } from "#index";
import { logger } from "#util/Util.js";

client.on("shardReady", (id) => logger(`[Shard ${id}] Shard has been connected`));
