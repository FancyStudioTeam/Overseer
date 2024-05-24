import {
  ChannelTypes,
  type ComponentInteraction,
  type MessageComponentSelectMenuInteractionData,
  type PermissionName,
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

    const data = <MessageComponentSelectMenuInteractionData>interaction.data;
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

    const channels = {
      suggestion: interaction.guild.channels.get(channel.id),
      revision: interaction.guild.channels.get(
        guildSuggestion.revision_channel_id,
      ),
    };

    if (channels.revision && channels.suggestion?.id === channels.revision.id) {
      return errorMessage(interaction, true, {
        description: client.locales.__({
          phrase:
            "commands.configuration.suggestions.row.general.row.channel.cannot-be-same",
          locale: language,
        }),
      });
    }

    const requiredPermissions: PermissionName[] = [];

    (<PermissionName[]>[
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "EMBED_LINKS",
      "USE_EXTERNAL_EMOJIS",
    ]).forEach((p, _) => {
      if (!channel.permissionsOf(interaction.guild.clientMember).has(p)) {
        requiredPermissions.push(p);
      }
    });

    if (
      !channel
        .permissionsOf(interaction.guild.clientMember)
        .has(...requiredPermissions)
    ) {
      return errorMessage(interaction, true, {
        description: client.locales.__mf(
          {
            phrase: "general.permissions.bot-channel-permissions",
            locale: language,
          },
          {
            permission: requiredPermissions
              .map((p, _) => {
                return permissions[p][language];
              })
              .join(", "),
            channel: channel.mention,
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
            guild: interaction.guild,
          },
          newData,
          {
            channel: interaction.channelID,
            message: interaction.message.id,
          },
        );
      });
  },
});
