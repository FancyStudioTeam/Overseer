import { Result } from "@sapphire/result";
import { ChannelTypes } from "oceanic.js";
import { Developers } from "#constants";
import { client } from "#index";
import { handleError } from "#util/Util";

client.on("messageCreate", async (message) => {
  const prefix = ">";

  if (!(message.inCachedGuildChannel() && message.guild)) return;
  if (!message.channel) return;
  if (message.channel.type !== ChannelTypes.GUILD_TEXT) return;
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const [commandName, ...args] = message.content.slice(prefix.length).trim().split(" ");
  const command = client.prefixCommands.get(commandName.toLowerCase());

  if (command) {
    if (command.developerOnly && !Developers.includes(message.author.id)) return;

    const result = await Result.fromAsync<unknown, Error>(
      async () =>
        await command.run({
          args,
          context: message,
        }),
    );

    if (result.isErr()) {
      return await handleError(result.unwrapErr(), {
        context: message,
      });
    }
  }
});
