import { inlineCodeBlock } from "@sapphire/utilities";
import { Embed } from "oceanic-builders";
import {
  type AnyInteractionGateway,
  type AnyTextableGuildChannel,
  type Member,
  type Message,
  MessageFlags,
  type PermissionName,
} from "oceanic.js";
import { Colors } from "#constants";
import { client } from "#index";
import { Translations } from "#translations";
import type { Locales } from "#types";
import { createMessage } from "./createMessage";

export const checkMemberPermissions = async (
  member: Member,
  {
    channel,
    context,
    locale,
    permissionsToCheck,
    shouldBeEphemeral = true,
    type = CheckPermissionsFrom.GUILD,
  }: {
    channel?: AnyTextableGuildChannel;
    context: AnyInteractionGateway | Message;
    locale: Locales;
    permissionsToCheck: PermissionName[];
    shouldBeEphemeral?: boolean;
    type?: CheckPermissionsFrom;
  },
) => {
  let hasPermissions = true;

  if (!(context.inCachedGuildChannel() && context.guild)) return false;

  const clientOrUser = member.id === client.user.id ? "CLIENT" : "USER";
  const channelOrGuild = type === CheckPermissionsFrom.CHANNEL ? "CHANNEL" : "GUILD";
  const missingPermissions = permissionsToCheck.filter((permission) =>
    channelOrGuild === "CHANNEL"
      ? !channel?.permissionsOf(member).has(permission)
      : !member.permissions.has(permission),
  );

  if (missingPermissions.length > 0) {
    hasPermissions = false;
    await createMessage(context, {
      embeds: new Embed()
        .setDescription(
          Translations[locale].GLOBAL.PERMISSIONS[channelOrGuild][clientOrUser]({
            permissions: missingPermissions
              .map((permission, _) => {
                return inlineCodeBlock(Translations[locale].PERMISSIONS[permission]);
              })
              .join(", "),
            channel: channel?.mention ?? "",
          }),
        )
        .setColor(Colors.RED)
        .toJSON(true),
      flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
    });
  }

  return hasPermissions;
};

export enum CheckPermissionsFrom {
  CHANNEL,
  GUILD,
}
