import {
  ChannelTypes,
  type ComponentInteraction,
  type MessageComponentSelectMenuInteractionData,
} from "oceanic.js";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { permissions } from "../../../locales/misc/reference";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";
import { updateGeneralMessage } from "../../buttons/suggestions/suggestions-general";

export default new Component({
  name: "suggestions-general-channel",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language, premium },
  ) => {
    await interaction.deferUpdate().catch(() => null);

    if (!interaction.guild) {
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

    const data = interaction.data as MessageComponentSelectMenuInteractionData;
    const channel = interaction.guild.channels.get(
      data.values.getChannels()[0].id,
    );

    if (channel?.type !== ChannelTypes.GUILD_TEXT) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase:
            "commands.configuration.suggestions.row.general.row.channel.invalid-channel-type",
          locale: language,
        }),
      });
    }

    if (
      !channel
        .permissionsOf(interaction.guild.clientMember)
        .has("VIEW_CHANNEL", "SEND_MESSAGES")
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__mf(
          {
            phrase: "general.permissions.bot-channel-permissions",
            locale: language,
          },
          {
            permission: [
              permissions.VIEW_CHANNEL[language],
              permissions.SEND_MESSAGES[language],
            ].join(", "),
          },
        ),
      });
    }

    await prisma.guildSuggestion
      .update({
        where: {
          guild_id: guildSuggestion.guild_id,
        },
        data: {
          channel_id: channel.id,
        },
      })
      .then(async (newData) => {
        await updateGeneralMessage(
          {
            client,
            language,
            premium,
          },
          newData,
          interaction.message,
        );
      });
  },
});
