import { client } from "@index";
import { Translations } from "@translations";
import type { AnyContext, Locales } from "@types";
import type { AnyTextableGuildChannel, Member, PermissionName } from "oceanic.js";
import { createMessage } from "./createMessage.js";

const CLIENT_OR_USER = (userId: string) => (userId === client.user.id ? "CLIENT" : "USER");

export const checkChannelMemberPermissions = async (
  member: Member,
  {
    channel,
    context,
    locale,
    permissionsToCheck,
    shouldBeEphemeral = true,
  }: {
    channel: AnyTextableGuildChannel;
    context: AnyContext;
    locale: Locales;
    permissionsToCheck: PermissionName[];
    shouldBeEphemeral?: boolean;
  },
) => {
  if (!(context.inCachedGuildChannel() && context.guild)) {
    return false;
  }

  let hasPermissions = true;
  const missingPermissions = permissionsToCheck.filter((permission) => !channel.permissionsOf(member).has(permission));
  const missingPermissionsString = missingPermissions
    .map((permission) => Translations[locale].PERMISSIONS[permission])
    .join(", ");

  if (missingPermissions.length > 0) {
    hasPermissions = false;

    await createMessage(
      context,
      Translations[locale].GLOBAL.PERMISSIONS.CHANNEL[CLIENT_OR_USER(member.id)]({
        channelMention: channel.mention,
        permissions: missingPermissionsString,
      }),
      {
        shouldBeEphemeral,
      },
    );
  }

  return hasPermissions;
};
