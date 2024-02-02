import { type ComponentInteraction, TextInputStyles } from "oceanic.js";
import { ModalBuilder } from "../../../builders/Modal";
import { TextInputBuilder } from "../../../builders/TextInput";
import { Component } from "../../../classes/Builders";
import type { Fancycord } from "../../../classes/Client";
import { prisma } from "../../../util/db";
import { errorMessage } from "../../../util/util";

export default new Component({
  name: "suggest-manage-approve",
  permissions: {
    user: "MANAGE_GUILD",
  },
  run: async (
    client: Fancycord,
    interaction: ComponentInteraction,
    { language },
  ) => {
    const userSuggestion = await prisma.userSuggestion.findUnique({
      where: {
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
        .setCustomID("suggest-manage-approve")
        .setTitle(
          client.locales.__({
            phrase:
              "commands.utility.suggest.row.manage.row.approve.modal.title",
            locale: language,
          }),
        )
        .addComponents([
          new TextInputBuilder()
            .setCustomID("suggest-manage-approve-reason")
            .setLabel(
              client.locales.__({
                phrase:
                  "commands.utility.suggest.row.manage.row.approve.modal.label",
                locale: language,
              }),
            )
            .setStyle(TextInputStyles.SHORT)
            .setMinLength(5)
            .setMaxLength(150)
            .setRequired(true),
        ])
        .toJSON(),
    );
  },
});
