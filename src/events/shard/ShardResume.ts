import { client } from "#index";
import { logger } from "#util/Util.js";

client.on("shardResume", (id) => logger(`[Shard ${id}] Shard has been resumed`));
