import { Event } from "../../classes/Builders";
import { client } from "../../index";
import { logger } from "../../util/util";

export default new Event("ready", true, async () => {
  await client.deploy();
  logger(`${client.user.username} has been connected`);
});
