import { Developers } from "@constants";
import { client } from "@index";
import { Result } from "@sapphire/result";
import type { Locales } from "@types";
import { checkGuildMemberPermissions, handleError } from "@utils";
import type { ComponentInteraction } from "oceanic.js";

export const handleSelectMenu = async (
  context: ComponentInteraction,
  collectionKey: string,
  {
    isPremium,
    locale,
    variable,
  }: {
    isPremium: boolean;
    locale: Locales;
    variable: string;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) return;
  if (!context.isSelectMenuComponentInteraction()) return;

  const component = client.components.selectMenus.get(collectionKey);

  if (component) {
    if (component.developerOnly && !Developers.includes(context.user.id)) {
      return await context.deferUpdate();
    }

    if (component.permissions) {
      if (component.permissions.user) {
        const userHasCommandPermissions = await checkGuildMemberPermissions(context.member, {
          context,
          locale,
          permissionsToCheck: component.permissions.user,
        });

        if (!userHasCommandPermissions) return;
      }

      if (component.permissions.bot) {
        const clientHasCommandPermissions = await checkGuildMemberPermissions(context.guild.clientMember, {
          context,
          locale,
          permissionsToCheck: component.permissions.bot,
        });

        if (!clientHasCommandPermissions) return;
      }
    }

    const result = await Result.fromAsync<unknown, Error>(
      async () =>
        await component.run({
          client,
          context,
          isPremium,
          locale,
          variable,
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
