import type { Prisma } from "@prisma/client";
import type { CommandInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
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

    const locale = interaction.data.options.getString("language", true);
    const guildConfiguration = await prisma.guildConfiguration.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });
    let newData: Prisma.GuildConfigurationCreateInput;

    if (guildConfiguration) {
      newData = await prisma.guildConfiguration.update({
        where: {
          guild_id: interaction.guild.id,
        },
        data: {
          language: locale,
        },
      });
    } else {
      newData = await prisma.guildConfiguration.create({
        data: {
          guild_id: interaction.guild.id,
          language: locale,
        },
      });
    }

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__({
            phrase: "commands.configuration.language.message",
            locale: newData.language,
          }),
        )
        .setColor(client.config.colors.success)
        .toJSONArray(),
    });
  },
});
