import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";
import { prisma } from "../../../../util/db";
import { timezones } from "../../../../util/timezones";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "timezone",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: CommandInteraction,
    { locale }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: translations[locale].GENERAL.INVALID_GUILD_PROPERTY({
          structure: interaction,
        }),
      });
    }

    const timezone = interaction.data.options.getString("timezone", true);
    const hour12 = interaction.data.options.getBoolean("12-hours", true);
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });

    if (!Object.keys(timezones).includes(timezone)) {
      return errorMessage(interaction, true, {
        description: translations[
          locale
        ].COMMANDS.CONFIG.TIMEZONE.ERRORS.TIMEZONE_NOT_FOUND({
          timezone,
        }),
      });
    }

    if (guildConfiguration) {
      await prisma.guildConfiguration.update({
        where: {
          guild_id: interaction.guild.id,
        },
        data: {
          timezone,
          hour12,
        },
      });
    } else {
      await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild.id,
          timezone,
          hour12,
        },
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          translations[locale].COMMANDS.CONFIG.TIMEZONE.MESSAGE({
            timezone,
          })
        )
        .setColor(client.config.colors.success)
        .toJSONArray(),
    });
  },
});
