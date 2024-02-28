import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { translations } from "../../../../locales/translations";
import type { Locales } from "../../../../types";
import { prisma } from "../../../../util/db";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "language",
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

    const language = interaction.data.options.getString("language", true);
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
          language,
        },
      });
    } else {
      await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild.id,
          language,
        },
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          translations[<Locales>language].COMMANDS.CONFIG.LANGUAGE.MESSAGE
        )
        .setColor(client.config.colors.success)
        .toJSONArray(),
    });
  },
});
