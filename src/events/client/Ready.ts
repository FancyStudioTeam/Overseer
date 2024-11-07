import { client } from "@index";
import { createLogMessage } from "@utils";

client.once("ready", async () => {
  await client.deploy();

  createLogMessage(`[${client.user.username}] ${client.user.username} has been connected`);
});
