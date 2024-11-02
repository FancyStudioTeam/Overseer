import { client } from "@index";
import { Result } from "@sapphire/result";
import type { Locales } from "@types";
import { handleError } from "@utils";
import type { CommandInteraction } from "oceanic.js";

export const handleUserCommand = async (
  context: CommandInteraction,
  collectionKey: string,
  {
    isPremium,
    locale,
  }: {
    isPremium: boolean;
    locale: Locales;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.isUserCommand()) return;

  const command = client.interactions.user.get(collectionKey);

  if (command) {
    const result = await Result.fromAsync<unknown, Error>(
      async () =>
        await command.run({
          client,
          context,
          isPremium,
          locale,
        }),
    );

    if (result.isErr()) {
      return await handleError(context, {
        error: result.unwrapErr(),
        locale,
      });
    }
  }
};
