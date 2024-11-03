import { client } from "@index";
import { Translations } from "@translations";
import type { Locales } from "@types";
import type { AnyInteractionGateway, Member, Message, PermissionName } from "oceanic.js";
import { createMessage } from "./createMessage.js";

const CLIENT_OR_USER = (userId: string) => (userId === client.user.id ? "CLIENT" : "USER");
export const checkGuildMemberPermissions = async (
  member: Member,
  {
    context,
    locale,
    permissionsToCheck,
    shouldBeEphemeral = true,
  }: {
    context: AnyInteractionGateway | Message;
    locale: Locales;
    permissionsToCheck: PermissionName[];
    shouldBeEphemeral?: boolean;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) {
    return false;
  }

  let hasPermissions = true;
  const missingPermissions = permissionsToCheck.filter((permission) => !member.permissions.has(permission));
  const missingPermissionsString = missingPermissions
    .map((permission) => Translations[locale].PERMISSIONS[permission])
    .join(", ");

  if (missingPermissions.length > 0) {
    hasPermissions = false;

    await createMessage(
      context,
      Translations[locale].GLOBAL.PERMISSIONS.GUILD[CLIENT_OR_USER(member.id)]({
        permissions: missingPermissionsString,
      }),
      {
        shouldBeEphemeral,
      },
    );
  }

  return hasPermissions;
};
