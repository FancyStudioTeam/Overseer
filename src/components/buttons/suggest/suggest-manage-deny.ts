import { type ComponentInteraction, TextInputStyles } from "oceanic.js";
import { ModalBuilder } from "../../../builders/Modal";
import { TextInputBuilder } from "../../../builders/TextInput";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggest-manage-deny",
  permissions: {
    user: "MANAGE_GUILD",
  },
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

    await interaction.createModal(
      new ModalBuilder()
        .setCustomID("suggest-manage-deny")
        .setTitle(
          client.locales.__({
            phrase: "commands.utility.suggest.row.manage.row.deny.modal.title",
            locale: language,
          })
        )
        .addComponents([
          new TextInputBuilder()
            .setCustomID("suggest-manage-deny-reason")
            .setLabel(
              client.locales.__({
                phrase:
                  "commands.utility.suggest.row.manage.row.deny.modal.label",
                locale: language,
              })
            )
            .setStyle(TextInputStyles.SHORT)
            .setMinLength(5)
            .setMaxLength(150)
            .setRequired(true),
        ])
        .toJSON()
    );
  },
});
