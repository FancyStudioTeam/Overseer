import { Event } from "../../classes/Builders";
import { client } from "../../index";
import { logger } from "../../util/logger";

export default new Event("ready", true, async () => {
  await client.deploy();
  logger.log(
    "INF",
    `[${client.user.username}] ${client.user.username} has been connected`
  );
});
