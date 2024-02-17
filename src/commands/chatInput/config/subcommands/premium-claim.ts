import ms from "ms";
import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "premium_claim",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { language },
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const code = interaction.data.options.getString("code", true);
    const clientPremium = await prisma.clientPremium.findUnique({
      where: {
        voucher_id: code.trim(),
      },
    });

    if (!clientPremium) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.premium.claim.code-not-found",
          locale: language,
        }),
      });
    }

    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });

    if (guildConfiguration) {
      await prisma.guildConfiguration.update({
        where: {
          guild_id: interaction.guild.id,
        },
        data: {
          premium: true,
          expires_at:
            clientPremium.type === "monthly" ? Date.now() + ms("30 days") : 0,
        },
      });
    } else {
      await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild.id,
          premium: true,
          expires_at:
            clientPremium.type === "monthly" ? Date.now() + ms("30 days") : 0,
        },
      });
    }

    interaction
      .reply({
        embeds: new EmbedBuilder()
          .setDescription(
            client.locales.__({
              phrase: "commands.configuration.premium.claim.message",
              locale: language,
            }),
          )
          .setColor(client.config.colors.success)
          .toJSONArray(),
      })
      .then(async () => {
        await prisma.clientPremium.delete({
          where: {
            voucher_id: clientPremium.voucher_id,
          },
        });
      });
  },
});
