import { Client, type Message } from "oceanic.js";
import { handlePrefixCommand } from "../../util/prefixHandler";

const client = new Client({
  /* ... */
});

client.on("messageCreate", async (message: Message) => {
  if (!(message.inCachedGuildChannel() && message.guild)) return;
  if (message.author.bot) return;

  await handlePrefixCommand(message);
});

client.connect();
