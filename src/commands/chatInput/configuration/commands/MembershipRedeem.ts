import { ClientMembershipType } from "@prisma/client";
import { Duration } from "@sapphire/time-utilities";
import { Translations } from "@translations";
import { CommandCategory, createChatInputSubCommand } from "@util/Handlers";
import { createErrorMessage, createMessage } from "@util/utils";

const IS_INFINITE_MEMBERSHIP = (voucherType: ClientMembershipType) => voucherType === ClientMembershipType.INFINITE;
const MEMBERSHIP_EXPIRATION = (voucherType: ClientMembershipType) =>
  IS_INFINITE_MEMBERSHIP(voucherType) ? null : new Date(Date.now() + new Duration("30d").offset);

export default createChatInputSubCommand({
  category: CommandCategory.CONFIGURATION,
  name: "membership_redeem",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  run: async ({ client, context, locale }) => {
    const membershipIdOption = context.data.options.getString("membership_id", true);
    const clientMembership = await client.prisma.clientMembership.findUnique({
      select: {
        general: true,
        membershipId: true,
      },
      where: {
        membershipId: membershipIdOption,
      },
    });

    if (!clientMembership) {
      return await createErrorMessage(
        context,
        Translations[locale].COMMANDS.CONFIGURATION.MEMBERSHIP.REEDEM.MEMBERSHIP_NOT_FOUND({
          membershipId: membershipIdOption,
        }),
      );
    }

    const [, { membershipId }] = await client.prisma.$transaction([
      client.prisma.guildConfiguration.upsert({
        create: {
          general: {},
          guildId: context.guildID,
          premium: {
            expiresAt: MEMBERSHIP_EXPIRATION(clientMembership.general.type),
            isEnabled: true,
          },
        },
        update: {
          premium: {
            expiresAt: MEMBERSHIP_EXPIRATION(clientMembership.general.type),
            isEnabled: true,
          },
        },
        where: {
          guildId: context.guildID,
        },
      }),
      client.prisma.clientMembership.delete({
        where: {
          membershipId: clientMembership.membershipId,
        },
      }),
    ]);

    return await createMessage(
      context,
      Translations[locale].COMMANDS.CONFIGURATION.MEMBERSHIP.REEDEM.MESSAGE_1({
        membershipId,
      }),
    );
  },
});
