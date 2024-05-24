import ms from "ms";
import type { CommandInteraction } from "oceanic.js";
import { Colors } from "../../../../Constants";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Translations } from "../../../../locales";
import { prisma } from "../../../../util/Prisma";
import {
  errorMessage,
  formatTimestamp,
  handleError,
} from "../../../../util/Util";

export default new SubCommand({
  name: "premium_claim",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction,
    { locale, timezone, hour12 },
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(
        {
          _context: _interaction,
          ephemeral: true,
        },
        {
          description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
            structure: _interaction,
          }),
        },
      );
    }

    const _voucherOption = _interaction.data.options.getString("code", true);
    const clientVoucher = await prisma.clientVoucher.findUnique({
      where: {
        voucher_id: _voucherOption.trim(),
      },
    });

    if (!clientVoucher) {
      return await errorMessage(
        {
          _context: _interaction,
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

    await prisma
      .$transaction([
        prisma.guildConfiguration.upsert({
          where: {
            guild_id: _interaction.guild.id,
          },
          update: {
            premium: {
              enabled: true,
              expires_at: {
                MONTH: Date.now() + ms("30 days"),
                INFINITE: 0,
              }[clientVoucher.general.type],
            },
          },
          create: {
            guild_id: _interaction.guild.id,
            general: {},
            premium: {
              enabled: true,
              expires_at: {
                MONTH: Date.now() + ms("30 days"),
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
      ])
      .then(async () => {
        await _interaction.reply({
          embeds: new EmbedBuilder()
            .setDescription(
              Translations[locale].COMMANDS.CONFIG.PREMIUM.CLAIM.MESSAGE_1({
                expireDate: {
                  MONTH: formatTimestamp(
                    new Date(Date.now() + ms("30 days")).toLocaleString(
                      "en-US",
                      {
                        timeZone: timezone,
                      },
                    ),
                    hour12,
                  ),
                  INFINITE: null,
                }[clientVoucher.general.type],
              }),
            )
            .setColor(Colors.SUCCESS)
            .toJSONArray(),
        });
      })
      .catch(async (error) => {
        await handleError(
          {
            _context: _interaction,
            locale,
          },
          error,
        );
      });
  },
});
