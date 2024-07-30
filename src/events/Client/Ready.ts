import { client } from "#index";
import { logger } from "#util/Util.js";

client.once("ready", async () => {
  await client.deploy();

  logger({
    content: `[${client.user.username}] ${client.user.username} has been connected`,
  });
});
