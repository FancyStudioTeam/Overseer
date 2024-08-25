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
import { match } from "ts-pattern";
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
  if (!(context.inCachedGuildChannel() && context.guild)) return false;

  let hasPermissions = true;
  let missingPermissions: PermissionName[] = [];
  let descriptionMessage = "";
  const isClientOrUser = member.id === client.user.id ? "CLIENT" : "USER";

  match(type)
    .with(CheckPermissionsFrom.CHANNEL, () => {
      missingPermissions = permissionsToCheck.filter((permission) => !channel?.permissionsOf(member).has(permission));
      descriptionMessage = Translations[locale].GLOBAL.PERMISSIONS.CHANNEL[isClientOrUser]({
        permissions: missingPermissions
          .map((permission, _) => inlineCodeBlock(Translations[locale].PERMISSIONS[permission]))
          .join(", "),
        channel: channel?.mention ?? "",
      });
    })
    .with(CheckPermissionsFrom.GUILD, () => {
      missingPermissions = permissionsToCheck.filter((permission) => !member.permissions.has(permission));
      descriptionMessage = Translations[locale].GLOBAL.PERMISSIONS.GUILD[isClientOrUser]({
        permissions: missingPermissions
          .map((permission, _) => inlineCodeBlock(Translations[locale].PERMISSIONS[permission]))
          .join(", "),
      });
    });

  if (missingPermissions.length) {
    hasPermissions = false;

    await createMessage(context, {
      embeds: new Embed().setDescription(descriptionMessage).setColor(Colors.RED).toJSON(true),
      flags: shouldBeEphemeral ? MessageFlags.EPHEMERAL : undefined,
    });
  }

  return hasPermissions;
};

export enum CheckPermissionsFrom {
  CHANNEL,
  GUILD,
}
