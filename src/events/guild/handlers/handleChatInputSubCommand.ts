import { client } from "@index";
import { Result } from "@sapphire/result";
import type { Locales } from "@types";
import { checkMemberPermissions, handleError } from "@utils";
import type { CommandInteraction } from "oceanic.js";

export const handleChatInputSubCommand = async (
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
  if (!context.isChatInputCommand()) return;

  const command = client.subCommands.get(collectionKey);

  if (command) {
    if (command.permissions) {
      if (command.permissions.user) {
        const userHasCommandPermissions = await checkMemberPermissions(context.member, {
          context,
          locale,
          permissionsToCheck: command.permissions.user,
        });

        if (!userHasCommandPermissions) return;
      }

      if (command.permissions.bot) {
        const clientHasCommandPermissions = await checkMemberPermissions(context.guild.clientMember, {
          context,
          locale,
          permissionsToCheck: command.permissions.bot,
        });

        if (!clientHasCommandPermissions) return;
      }
    }

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
