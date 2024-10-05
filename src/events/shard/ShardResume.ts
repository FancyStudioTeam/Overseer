import { client } from "@index";
import { logger } from "@utils";

client.on("shardResume", (id) => logger(`[Shard ${id}] Shard has been resumed`));
