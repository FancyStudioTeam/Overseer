import { Prisma } from "@prisma/client";
import {
  ButtonStyles,
  type ComponentInteraction,
  type Guild,
} from "oceanic.js";
import { ActionRowBuilder } from "../../../builders/ActionRow";
import { ButtonBuilder } from "../../../builders/Button";
import { EmbedBuilder } from "../../../builders/Embed";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggestions-general",
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

    await updateGeneralMessage(
      {
        client,
        language,
        premium,
        guild: interaction.guild,
      },
      guildSuggestion,
      {
        channel: interaction.channelID,
        message: interaction.message.id,
      },
    );
  },
});

export async function updateGeneralMessage(
  main: {
    client: Fancycord;
    language: string;
    premium?: boolean;
    guild: Guild;
  },
  data: Prisma.GuildSuggestionCreateInput | null,
  id: {
    channel: string;
    message: string;
  },
): Promise<void> {
  await main.client.rest.channels
    .editMessage(id.channel, id.message, {
      embeds: new EmbedBuilder()
        .setAuthor({
          name: main.guild.name,
          iconURL: main.guild.iconURL() ?? main.client.user.avatarURL(),
        })
        .setThumbnail(main.guild.iconURL() ?? main.client.user.avatarURL())
        .addFields([
          {
            name: main.client.locales.__({
              phrase:
                "commands.configuration.suggestions.row.general.message.field",
              locale: main.language,
            }),
            value: main.client.locales.__mf(
              {
                phrase:
                  "commands.configuration.suggestions.row.general.message.value",
                locale: main.language,
              },
              {
                channel:
                  main.guild.channels.get(data?.channel_id ?? "")?.mention ??
                  "<:_:1201586248947597392>",
                messageSuggestion: data?.message_suggestions
                  ? "<:_:1203774493936455730>"
                  : "<:_:1203774491763937300>",
                threads: data?.threads
                  ? "<:_:1203774493936455730>"
                  : "<:_:1203774491763937300>",
              },
            ),
          },
          {
            name: main.client.locales.__({
              phrase:
                "commands.configuration.suggestions.row.general.message.field2",
              locale: main.language,
            }),
            value: main.client.locales.__mf(
              {
                phrase:
                  "commands.configuration.suggestions.row.general.message.value2",
                locale: main.language,
              },
              {
                reviewChannel:
                  main.guild.channels.get(data?.revision_channel_id ?? "")
                    ?.mention ?? "<:_:1201586248947597392>",
                review: data?.revision_enabled
                  ? "<:_:1203774493936455730>"
                  : "<:_:1203774491763937300>",
              },
            ),
          },
        ])
        .setColor(main.client.config.colors.color)
        .toJSONArray(),
      components: [
        new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setCustomID("suggestions-general-channel")
              .setLabel(
                main.client.locales.__({
                  phrase:
                    "commands.configuration.suggestions.row.general.row.channel.label",
                  locale: main.language,
                }),
              )
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji({
                name: "_",
                id: "1203801953088442418",
              }),
            new ButtonBuilder()
              .setCustomID("suggestions-general-message")
              .setLabel(
                main.client.locales.__({
                  phrase:
                    "commands.configuration.suggestions.row.general.row.message.label",
                  locale: main.language,
                }),
              )
              .setStyle(
                data?.message_suggestions
                  ? ButtonStyles.SUCCESS
                  : ButtonStyles.SECONDARY,
              )
              .setEmoji({
                name: "_",
                id: data?.message_suggestions
                  ? "1203774493936455730"
                  : "1203774491763937300",
              }),
            new ButtonBuilder()
              .setCustomID("suggestions-general-threads")
              .setLabel(
                main.client.locales.__({
                  phrase:
                    "commands.configuration.suggestions.row.general.row.threads.label",
                  locale: main.language,
                }),
              )
              .setStyle(
                data?.threads ? ButtonStyles.SUCCESS : ButtonStyles.SECONDARY,
              )
              .setEmoji({
                name: "_",
                id: data?.threads
                  ? "1203774493936455730"
                  : "1203774491763937300",
              })
              .setDisabled(!main.premium),
          ])
          .toJSON(),
        new ActionRowBuilder()
          .addComponents([
            new ButtonBuilder()
              .setCustomID("suggestions-general-revision-channel")
              .setLabel(
                main.client.locales.__({
                  phrase:
                    "commands.configuration.suggestions.row.general.row.revision-channel.label",
                  locale: main.language,
                }),
              )
              .setStyle(ButtonStyles.SECONDARY)
              .setEmoji({
                name: "_",
                id: "1203801953088442418",
              }),
            new ButtonBuilder()
              .setCustomID("suggestions-general-revision")
              .setLabel(
                main.client.locales.__({
                  phrase:
                    "commands.configuration.suggestions.row.general.row.revision.label",
                  locale: main.language,
                }),
              )
              .setStyle(
                data?.revision_enabled
                  ? ButtonStyles.SUCCESS
                  : ButtonStyles.SECONDARY,
              )
              .setEmoji({
                name: "_",
                id: data?.revision_enabled
                  ? "1203774493936455730"
                  : "1203774491763937300",
              }),
          ])
          .toJSON(),
      ],
    })
    .catch(() => null);
}
