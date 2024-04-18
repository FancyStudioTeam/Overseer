import { client } from "../..";
import { Event } from "../../classes/Builders";
import { LoggerType } from "../../types";
import { logger } from "../../util/util";

export default new Event("ready", true, async () => {
  await client.deploy();
  logger(
    LoggerType.INFO,
    `[${client.user.username}] ${client.user.username} has been connected`
  );
});
