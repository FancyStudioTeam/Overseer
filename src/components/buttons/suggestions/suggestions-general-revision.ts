import type { ComponentInteraction } from "oceanic.js";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";
import { updateGeneralMessage } from "./suggestions-general";

export default new Component({
  name: "suggestions-general-revision",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language, premium }
  ) => {
    await interaction.deferUpdate().catch(() => null);

    if (!interaction.inCachedGuildChannel() || !interaction.guild) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "general.cannot-get-guild",
          locale: language,
        }),
      });
    }

    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });

    if (!guildSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.suggestions.system-not-enabled",
          locale: language,
        }),
      });
    }

    const channel = interaction.guild.channels.get(
      guildSuggestion.revision_channel_id
    );

    if (!channel) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase:
            "commands.configuration.suggestions.row.general.row.revision.revision-not-found",
          locale: language,
        }),
      });
    }

    await prisma.guildSuggestion
      .update({
        where: {
          guild_id: guildSuggestion.guild_id,
        },
        data: {
          revision_enabled: !guildSuggestion.revision_enabled,
        },
      })
      .then(async (newData) => {
        await updateGeneralMessage(
          {
            client,
            language,
            premium,
            guild: interaction.guild,
          },
          newData,
          {
            channel: interaction.channelID,
            message: interaction.message.id,
          }
        );
      });
  },
});
