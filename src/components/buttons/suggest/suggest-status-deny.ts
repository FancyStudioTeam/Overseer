import { type ComponentInteraction } from "oceanic.js";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggest-status-deny",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
  ) => {
    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        message_id: interaction.message.id,
      },
    });

    if (!userSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.utility.suggest.suggestion-not-found",
          locale: language,
        }),
      });
    }

    await prisma.userSuggestion
      .delete({
        where: {
          guild_id: userSuggestion.guild_id,
          message_id: userSuggestion.message_id,
        },
      })
      .then(async () => {
        await interaction.message.edit({
          embeds: new EmbedBuilder()
            .setDescription(
              client.locales.__({
                phrase: "commands.utility.suggest.row.status.deny.message",
                locale: language,
              }),
            )
            .setColor(client.config.colors.success)
            .toJSONArray(),
          components: [],
        });
      });
  },
});
