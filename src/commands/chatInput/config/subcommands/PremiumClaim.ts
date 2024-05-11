import ms from "ms";
import type {
  AnyInteractionChannel,
  ApplicationCommandTypes,
  CommandInteraction,
  Uncached,
} from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Discord } from "../../../../classes/Client";
import { Colors } from "../../../../constants";
import { Translations } from "../../../../locales";
import { prisma } from "../../../../util/db";
import {
  errorMessage,
  formatTimestamp,
  handleError,
} from "../../../../util/util";

export default new SubCommand({
  name: "premium_claim",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    _client: Discord,
    _interaction: CommandInteraction<
      AnyInteractionChannel | Uncached,
      ApplicationCommandTypes.CHAT_INPUT
    >,
    { locale, timezone, hour12 }
  ) => {
    if (!(_interaction.inCachedGuildChannel() && _interaction.guild)) {
      return await errorMessage(_interaction, true, {
        description: Translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: _interaction,
        }),
      });
    }

    const _voucherOption = _interaction.data.options.getString("code", true);
    const clientVoucher = await prisma.clientVoucher.findUnique({
      where: {
        voucher_id: _voucherOption.trim(),
      },
    });

    if (!clientVoucher) {
      return await errorMessage(_interaction, true, {
        description: Translations[
          locale
        ].COMMANDS.CONFIG.PREMIUM.CLAIM.MEMBERSHIP_NOT_FOUND({
          code: _voucherOption,
        }),
      });
    }

    await prisma
      .$transaction([
        prisma.guildConfiguration.upsert({
          where: {
            guild_id: _interaction.guild.id,
          },
          update: {
            premium: true,
            expires_at: {
              0: Date.now() + ms("30 days"),
              1: 0,
            }[clientVoucher.type],
          },
          create: {
            guild_id: _interaction.guild.id,
            premium: true,
            expires_at: {
              0: Date.now() + ms("30 days"),
              1: 0,
            }[clientVoucher.type],
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
                type: clientVoucher.type,
                expireDate: {
                  0: formatTimestamp(
                    new Date(Date.now() + ms("30 days")).toISOString(),
                    timezone,
                    hour12
                  ),
                  1: undefined,
                }[clientVoucher.type],
              })
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
          error
        );
      });
  },
});
