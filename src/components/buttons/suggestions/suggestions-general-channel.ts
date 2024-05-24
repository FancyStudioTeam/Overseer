import {
  ChannelTypes,
  type ComponentInteraction,
  ComponentTypes,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { SelectMenuBuilder } from "../../../builders/SelectMenu";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggestions-general-channel",
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

    if (!guildSuggestion) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase: "commands.configuration.suggestions.system-not-enabled",
          locale: language,
        }),
      });
    }

    await client.rest.channels
      .editMessage(interaction.channelID, interaction.message.id, {
        components: new ActionRowBuilder()
          .addComponents([
            new SelectMenuBuilder()
              .setCustomID("suggestions-general-channel")
              .setType(ComponentTypes.CHANNEL_SELECT)
              .setChannelTypes([ChannelTypes.GUILD_TEXT])
              .setDefaultValues(
                interaction.guild.channels.get(guildSuggestion.channel_id)
                  ? [
                      {
                        id: guildSuggestion.channel_id,
                        type: "channel",
                      },
                    ]
                  : [],
              ),
          ])
          .toJSONArray(),
      })
      .catch(() => null);
  },
});
