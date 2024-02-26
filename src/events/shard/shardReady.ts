import { ActivityTypes } from "oceanic.js";
import { client } from "../..";
import { version } from "../../../package.json";
import { Event } from "../../classes/Builders";
import { logger } from "../../util/logger";

export default new Event("shardReady", false, async (id: number) => {
  client.editStatus("online", [
    {
      name: ".",
      state: `🍃 Version ${version}`,
      type: ActivityTypes.CUSTOM,
    },
  ]);

  logger.log("INF", `[Shard ${id}] Shard has been connected`);
});
