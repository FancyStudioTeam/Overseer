import { ChannelTypes } from "oceanic.js";
import { Developers } from "#constants";
import { client } from "#index";

client.on("messageCreate", async (message) => {
  const prefix = ">";

  if (!(message.inCachedGuildChannel() && message.guild)) return;
  if (!message.channel) return;
  if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  if (!Developers.includes(message.author.id)) return;

  const [commandName, ...args] = message.content.slice(prefix.length).trim().split(" ");
  const command = client.prefixCommands.get(commandName.toLowerCase());

  if (command) {
    await command.run({
      args,
      context: message,
    });
  }
});
