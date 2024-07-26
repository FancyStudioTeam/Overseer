import { client } from "#index";
import { LoggerType, logger } from "#util/Util.js";

client.once("ready", async () => {
  await client.deploy();
  logger(LoggerType.INFO, `[${client.user.username}] ${client.user.username} has been connected`);
});
