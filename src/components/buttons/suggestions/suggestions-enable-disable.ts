import { Prisma } from "@prisma/client";
import type { ComponentInteraction } from "oceanic.js";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { updateMainMessage } from "../../../commands/chatInput/config/subcommands/suggestions";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggestions-enable-disable",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
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
    let newData: Prisma.GuildSuggestionCreateInput | null;

    if (guildSuggestion) {
      newData = await prisma.guildSuggestion
        .delete({
          where: {
            guild_id: guildSuggestion.guild_id,
          },
        })
        .then(() => {
          return null;
        });
    } else {
      newData = await prisma.guildSuggestion.create({
        data: {
          guild_id: interaction.guild.id,
          channel_id: "",
          revision_channel_id: "",
        },
      });
    }

    await updateMainMessage(
      {
        client,
        language,
      },
      newData,
      {
        channel: interaction.channelID,
        message: interaction.message.id,
      },
    );
  },
});
