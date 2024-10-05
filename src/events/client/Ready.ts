import { client } from "@index";
import { logger } from "@utils";

client.once("ready", async () => {
  await client.deploy();

  logger(`[${client.user.username}] ${client.user.username} has been connected`);
});
