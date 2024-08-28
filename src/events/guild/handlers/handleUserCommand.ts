import { Result } from "@sapphire/result";
import type { CommandInteraction } from "oceanic.js";
import { client } from "#index";
import type { Locales } from "#types";
import { handleError } from "#util/Util";

export const handleUserCommand = async (
  key: string,
  {
    handleArguments,
    context,
  }: {
    handleArguments: {
      locale: Locales;
      premium: boolean;
    };
    context: CommandInteraction;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;

  const command = client.interactions.user.get(key);

  if (command) {
    const result = await Result.fromAsync<unknown, Error>(
      async () =>
        await command.run({
          ...handleArguments,
          context,
        }),
    );

    if (result.isErr()) {
      return await handleError(result.unwrapErr(), {
        context,
      });
    }
  }
};
