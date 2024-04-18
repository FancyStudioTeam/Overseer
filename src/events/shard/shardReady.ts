import { ActivityTypes } from "oceanic.js";
import { client } from "../..";
import { version } from "../../../package.json";
import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event("shardReady", false, async (id: number) => {
  client.editStatus("online", [
    {
      name: ".",
      state: `🍃 Version ${version}`,
      type: ActivityTypes.CUSTOM,
    },
  ]);

  logger(LoggerType.INFO, `[Shard ${id}] Shard has been connected`);
});
