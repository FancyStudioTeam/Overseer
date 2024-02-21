import type { Prisma } from "@prisma/client";
import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
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
    { language }
  ) => {
    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const timezone = interaction.data.options.getString("timezone", true);
    const hours = interaction.data.options.getBoolean("12-hours", true);
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });
    let newData: Prisma.GuildConfigurationCreateInput;

    if (!Object.keys(timezones).includes(timezone)) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.timezone.timezone-not-found",
          locale: language,
        }),
      });
    }

    if (guildConfiguration) {
      newData = await prisma.guildConfiguration.update({
        where: {
          guild_id: interaction.guild.id,
        },
        data: {
          timezone: timezone,
          hour12: hours,
        },
      });
    } else {
      newData = await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild.id,
          timezone: timezone,
          hour12: hours,
        },
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__mf(
            {
              phrase: "commands.configuration.timezone.message",
              locale: language,
            },
            {
              timezone: newData.timezone,
            }
          )
        )
        .setColor(client.config.colors.success)
        .toJSONArray(),
    });
  },
});
