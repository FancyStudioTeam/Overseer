import type { Discord } from "@client";
import { client } from "@index";
import { Result } from "@sapphire/result";
import type { Locales } from "@types";
import { checkMemberPermissions, handleError } from "@utils";
import type { CommandInteraction } from "oceanic.js";

export const handleChatInputSubCommand = async (
  key: string,
  {
    handleArguments,
    context,
  }: {
    handleArguments: {
      client: Discord;
      isPremium: boolean;
      locale: Locales;
    };
    context: CommandInteraction;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;

  const { locale } = handleArguments;
  const command = client.subCommands.get(key);

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
