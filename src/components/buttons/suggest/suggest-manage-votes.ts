import {
  type ComponentInteraction,
  type EmbedOptions,
  MessageFlags,
} from "oceanic.js";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggest-manage-votes",
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
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

    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
        message_id: interaction.message.messageReference?.messageID,
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

    const embeds: EmbedOptions[] = [];

    if (userSuggestion.votes_up.length) {
      embeds.push({
        author: {
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL() ?? client.user.avatarURL(),
        },
        description: userSuggestion.votes_up
          .map((v) => {
            return `<:_:1201948012830531644> **${
              interaction.guild.members.get(v)?.mention ?? v
            }**`;
          })
          .join("\n"),
        color: client.config.colors.color,
      });
    } else {
      embeds.push({
        description: client.locales.__({
          phrase:
            "commands.utility.suggest.row.manage.row.votes.has-no-upvotes",
          locale: language,
        }),
        color: client.config.colors.error,
      });
    }

    if (userSuggestion.votes_down.length) {
      embeds.push({
        author: {
          name: interaction.guild.name,
          iconURL: interaction.guild.iconURL() ?? client.user.avatarURL(),
        },
        description: userSuggestion.votes_down
          .map((v) => {
            return `<:_:1201948012830531644> **${
              interaction.guild.members.get(v)?.mention ?? v
            }**`;
          })
          .join("\n"),
        color: client.config.colors.color,
      });
    } else {
      embeds.push({
        description: client.locales.__({
          phrase:
            "commands.utility.suggest.row.manage.row.votes.has-no-downvotes",
          locale: language,
        }),
        color: client.config.colors.error,
      });
    }

    interaction.reply({
      embeds: embeds,
      flags: MessageFlags.EPHEMERAL,
    });
  },
});
