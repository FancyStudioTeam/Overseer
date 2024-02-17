import type { Prisma } from "@prisma/client";
import { ButtonStyles, type CommandInteraction } from "oceanic.js";
import { ActionRowBuilder } from "../../../../builders/ActionRow";
import { ButtonBuilder } from "../../../../builders/Button";
import { EmbedBuilder } from "../../../../builders/Embed";
import { SubCommand } from "../../../../classes/Builders";
import type { Fancycord } from "../../../../classes/Client";
import { prisma } from "../../../../util/db";
import { errorMessage } from "../../../../util/util";

export default new SubCommand({
  name: "suggestions",
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

    const guildSuggestion = await prisma.guildSuggestion.findUnique({
      where: {
        guild_id: interaction.guild.id,
      },
    });

    interaction.reply({
      embeds: new EmbedBuilder()
        .setDescription(
          client.locales.__({
            phrase: "commands.configuration.suggestions.message.message",
            locale: language,
          }),
        )
        .setColor(client.config.colors.color)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("suggestions-general")
            .setLabel(
              client.locales.__({
                phrase: "commands.configuration.suggestions.row.general.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1203776136958713866",
            })
            .setDisabled(!guildSuggestion),
          new ButtonBuilder()
            .setCustomID("suggestions-votes")
            .setLabel(
              client.locales.__({
                phrase: "commands.configuration.suggestions.row.votes.label",
                locale: language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1203776136958713866",
            })
            .setDisabled(!guildSuggestion),
          new ButtonBuilder()
            .setCustomID("suggestions-enable-disable")
            .setStyle(
              guildSuggestion ? ButtonStyles.DANGER : ButtonStyles.SUCCESS,
            )
            .setEmoji({
              name: "_",
              id: guildSuggestion
                ? "1203774491763937300"
                : "1203774493936455730",
            }),
        ])
        .toJSONArray(),
    });
  },
});

export async function updateMainMessage(
  main: {
    client: Fancycord;
    language: string;
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
        .setDescription(
          main.client.locales.__({
            phrase: "commands.configuration.suggestions.message.message",
            locale: main.language,
          }),
        )
        .setColor(main.client.config.colors.color)
        .toJSONArray(),
      components: new ActionRowBuilder()
        .addComponents([
          new ButtonBuilder()
            .setCustomID("suggestions-general")
            .setLabel(
              main.client.locales.__({
                phrase: "commands.configuration.suggestions.row.general.label",
                locale: main.language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1203776136958713866",
            })
            .setDisabled(!data),
          new ButtonBuilder()
            .setCustomID("suggestions-votes")
            .setLabel(
              main.client.locales.__({
                phrase: "commands.configuration.suggestions.row.votes.label",
                locale: main.language,
              }),
            )
            .setStyle(ButtonStyles.SECONDARY)
            .setEmoji({
              name: "_",
              id: "1203776136958713866",
            })
            .setDisabled(!data),
          new ButtonBuilder()
            .setCustomID("suggestions-enable-disable")
            .setStyle(data ? ButtonStyles.DANGER : ButtonStyles.SUCCESS)
            .setEmoji({
              name: "_",
              id: data ? "1203774491763937300" : "1203774493936455730",
            }),
        ])
        .toJSONArray(),
    })
    .catch(() => null);
}
