import { Duration } from "@sapphire/time-utilities";
import type { CommandInteraction } from "oceanic.js";
import { BaseBuilder, EmbedBuilder } from "#builders";
import type { Discord } from "#classes";
import { Colors } from "#constants";
import { Translations } from "#locales";
import { type ChatInputSubCommandInterface, Directory } from "#types";
import { errorMessage, formatTimestamp } from "#util";
import { prisma } from "#util/Prisma";

export default new BaseBuilder<ChatInputSubCommandInterface>({
  name: "premium_claim",
  permissions: {
    user: ["MANAGE_GUILD"],
  },
  directory: Directory.CONFIGURATION,
  run: async (
    _client: Discord,
    _context: CommandInteraction,
    { locale, timezone, hour12 },
  ) => {
    if (!(_context.inCachedGuildChannel() && _context.guild)) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _context,
          }),
        },
      );
    }

    const _voucherOption = _context.data.options.getString("code", true);
    const clientVoucher = await prisma.clientVoucher.findUnique({
      where: {
        voucher_id: _voucherOption.trim(),
      },
    });

    if (!clientVoucher) {
      return await errorMessage(
        {
          _context,
          ephemeral: true,
        },
        {
          description: Translations[
            locale
          ].COMMANDS.CONFIG.PREMIUM.CLAIM.MEMBERSHIP_NOT_FOUND({
            code: _voucherOption,
          }),
        },
      );
    }

    await prisma.$transaction([
      prisma.guildConfiguration.upsert({
        where: {
          guild_id: _context.guildID,
        },
        update: {
          premium: {
            enabled: true,
            expires_at: {
              MONTH: Date.now() + new Duration("30 days").offset,
              INFINITE: 0,
            }[clientVoucher.general.type],
          },
        },
        create: {
          guild_id: _context.guildID,
          general: {},
          premium: {
            enabled: true,
            expires_at: {
              MONTH: Date.now() + new Duration("30 days").offset,
              INFINITE: 0,
            }[clientVoucher.general.type],
          },
        },
      }),
      prisma.clientVoucher.delete({
        where: {
          voucher_id: clientVoucher.voucher_id,
        },
      }),
    ]);

    await _context.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          Translations[locale].COMMANDS.CONFIG.PREMIUM.CLAIM.MESSAGE_1({
            expireDate: {
              MONTH: formatTimestamp(
                new Date(
                  Date.now() + new Duration("30 days").offset,
                ).toLocaleString("en-US", {
                  timeZone: timezone,
                }),
                hour12,
              ),
              INFINITE: null,
            }[clientVoucher.general.type],
          }),
        )
        .setColor(Colors.SUCCESS)
        .toJSONArray(),
    });
  },
});
